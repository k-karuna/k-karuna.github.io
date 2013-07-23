/* 2013-07-16 19:50:42 */


// data/ru/images/js/ru/build/MsgList.js start

if( 'jQuery' in window ) (function (jQuery, $) {

// @build
// @build-exclude: build/core.js
// @build-jquery
// @build-minify
// @deploy-wait-for: http://js.imgsmail.ru/u/js/ru/build/MsgList.js

// data/ru/images/js/ru/mailru.js start

/**
 * @object	mailru
 * @author	RubaXa	<trash@rubaxa.org>
 */

/*global $Scroll*/



// data/ru/images/js/ru/mailru.Updater.js start

/***
 * @class	mailru.Updater
 * @author	RubaXa	<trash@rubaxa.org>
 */

/*global createRadar, arMailRuFolders, arMailRuMessages*/

/** @namespace mailru.Updater */
	mailru.Updater = {

		  idx:		0
		, Banners:	[]
		, Folders:	[]
		, Messages:	{}
		, Request:	{}
		, radar:	createRadar('mailru_Updater')
		, stopCnt:	0
		, active:	false
		, disabled:	false
		, cts:		{}
		, lastTS:	0
		,

		run: function (){
			store.set('last_message_ts', mailru.CurrentTimestamp);

			if (ajs.offline) {

				mailru.Updater.reload();

			} else {

				if( 'arMailRuFolders' in window ){
					/** @namespace window.arMailRuFolders */
					mailru.Folders.set(window.arMailRuFolders, mailru.CurrentTimestamp, 1);
				}

				if( mailru.threads ){
//					mailru.Events.bind('updated.message', function (evt){
//						var msg = evt.DATA;
//						var thread = mailru.Threads.get(msg.thread);
//						if( thread ){
//							mailru.Threads.remove(thread);
//						}
//					});

					ajs.sleep(function (){
						mailru.Updater.reload(true);
					}, 100);
				}
				else {
					if( 'arMailRuMessages' in window ){
						/** @namespace window.arMailRuMessages */
						var id = mailru.folderId;
						if( mailru.isFilterFolder(id) ) id = 0;
						mailru.Messages.set(id, window.arMailRuMessages, mailru.CurrentTimestamp, 1);

						// MAIL-16248
						if (mailru.messagesSort === 'd' && $.isArray(arMailRuMessages) && arMailRuMessages.length === 0 && $.isArray(window.arMailRuFolders)) {
							var folder;
							$.each(arMailRuFolders, function (k, v) {
								var next = true;
								if (v.Id == id) {
									folder = v;
									next = false;
								}
								return next;
							});
							if (folder && folder.Messages) {
								mailru.messagesSort = 'D';
							}
						}
					}

					if( 'SearchData' in mailru ){
						mailru.Messages.set(mailru.getFolderId(), mailru.SearchData.messages, now());
						mailru.Messages.addSearchCache(GET, new mailru.Ajax.Result({ status: 'OK', data: mailru.SearchData }, {}, {}, 'success'));
					}
				}

				mailru.Events.trigger('stop.updater');
			}

			mailru.Events.bind('update.messages loaded.messages preload.messages', function (){
				// Preload messages
				if( mailru.isMsgList && !mailru.threads ){
					var M, List = mailru.Messages.getByFolder(mailru.getFolderId(), Math.max(GET.page>>0, 1));

					if( List.length ){
						if( 0 && /corp/.test(mailru.userdomain) ){
							// DISABLED:  https://jira.mail.ru/browse/MAIL-13841
							var from = -1, to = -1;

							for( var i = 0, n = List.length; i < n; i++ ){
								M = List[i];
								if( from == -1 ){
									if( M.Unread && !M._loading && !M._loaded && !M._preload ){
										from = i;
										break; // preload by one msg
									}
								} else if( !M.Unread || M._loading || M._loaded ) {
									break;
								} else {
									to	= i;
								}
							}

							if( from > -1 ){
								M = List[from];
								mailru.Messages.load({ folder: M.FolderId, id: M.Id }, to > 0 ? to-from+1 : 0);
							}
						} else {
							M = List[0];
							if( M.Unread && !M._loading && !M._loaded && !M._preload ){
								mailru.Messages.load({ folder: M.FolderId, id: M.Id }, 0);
							}
						}
					}
				}
			}).trigger('preload.messages');


			if( mailru.isMsgList ){
				this.__sortby   = (GET.sortby || mailru.messagesSort);
				this.cts[mailru.getFolderId()+'_'+Math.max(mailru.messagesPage, 1)+'_'+this.__sortby] = mailru.CurrentTimestamp;
			}

			setInterval(function (){
				if( !mailru.Updater.active || (ajs.now() - mailru.Updater.lastTS > 120000) ){
					mailru.Updater.reload();
				}
			}, 30*1000);
		},

		getCacheKey: function (id, page, sort){
			return	this.cts[id+'_'+Math.max(page|0,1)+'_'+(sort || mailru.messagesSort || '')];
		},


		// @private
		_request: function (id, data, force){
			var
				  fId		= defined(data.folder, mailru.getFolderId()) || 0
				, page		= Math.max(mailru.messagesPage, 1)
				, sortby	= ajs.htmlEncode(GET.sortby || '') || mailru.messagesSort
				, cacheKey	= fId + '_' + page + '_' + sortby
				, complete	= data.complete
			;

			var folder_sent = mailru.Folder.SENT;
			var folder_data = mailru.getFolderData(fId);

			// MAIL-13537
			if (fId == folder_sent || (folder_data && folder_data.ParentId == folder_sent)) {
				if (sortby == 'f') {
					sortby = 't';
				}
				else if (sortby == 'F') {
					sortby = 'T';
				}
			}

			if( sortby && (sortby != this.__sortby) ){
				// Reset cts
				this.__sortby = sortby;
				this.cts[cacheKey] = 0;
			}

			data	= {
						  force:	+(ajs.offline || (mailru.isMsgList && !mailru.Folders.hasCache(fId, page)))
						, now:		now()
						, page:		page
						, sortby:	sortby
						, ref:		mailru.getPageLabel()
						, bnrs:		(data.bnrs || 'N')
						, email:	mailru.useremail
						, cts:		(this.cts[cacheKey] || 1)
						// threads
						, offset:	(page-1) * mailru.messagesPerPage
						, limit:	mailru.messagesPerPage
					};

			if( fId >= 0 && fId != mailru.Folder.MRIM_ARCH && !mailru.isFilterFolder(fId) ){
				data.folder	= fId;
			}


			if( this.prevR )
				this._abort(this.prevR);

			this.prevR = this.Request[id] = {
				  'id':			id
				, 'data':		data
				, 'isAjax':		true || !force // https://jira.mail.ru/browse/MAIL-3230
			};

			var ajaxData = {
				url:		'/cgi-bin/checknew'+ (force ? '' : '?nolog=1')
				, data:		data
				, isUser:	!!force
				, loading:	!!data.force
				, loadPage:	true
				, complete:	this._receive.bind(this, id, complete)
			};

			if (mailru.IsChecknewToStatus) {
				if (mailru.threads) {
					this.Request[id].transport = mailru.API.ajax(ajaxData);
				}
				else {
					var sort = {
						type: 'date',
						order: 'desc'
					};

					if (sortby == 'd') {
						sort.type = 'date';
						sort.order = 'asc';
					} else if (sortby == 'f') {
						sort.type = 'from';
						sort.order = 'asc';
					} else if (sortby == 'F') {
						sort.type = 'from';
						sort.order = 'desc';
					} else if (sortby == 'T') {
						sort.type = 'to';
						sort.order = 'desc';
					} else if (sortby == 't') {
						sort.type = 'to';
						sort.order = 'asc';
					} else if (sortby == 's') {
						sort.type = 'from';
						sort.order = 'asc';
					} else if (sortby == 'S') {
						sort.type = 'from';
						sort.order = 'desc';
					}

					this.Request[id].transport = mailru.API({
						url: 'messages/status',
						convertResultToOldApi: true,
						isUser: !!force,
						loading: !!data.force,
						data: {
							nolog: force ? 0 : 1,

							// old params
							cts: data.cts,
							force: data.force,
							now: data.now,
							sortby: sortby,
							page: data.page,

							// new params
							sort: sort,
							folder: data.folder,
							offset: data.offset,
							limit: data.limit,
							last_modified: data.cts,
							htmlencoded: false
						},
						complete: this._receive.bind(this, id, complete)
					});
				}

			} else {
				this.Request[id].transport = mailru.API.ajax(ajaxData);
			}
		},

		/**
		 * @private
		 * @param	{Number} id
		 * @param	{mailru.Ajax.Result}	Result
		 */
		_receive: function (id, callback, Result){
			var Request		= this.Request[id];
			var Params		= Request.data;
			var isLast		= (id == this.idx);

			if( !Request.isAjax ){
				Result	= new mailru.Ajax.Result( Result, Request.data, null, 'success' );
			}

			this._abort(Request);

			if( isLast ){
				if( Result.isOK() || Result.isNOP() && Math.random() <= .1 ){
					var _dt = ajs.now() - Result.getOpts().__ts;
					mailru.radar('checknew', Result.getStatus()+'='+_dt, _dt);
				}

				mailru.Events.fire('beforestop.updater');

				this.active	= false;

				if( Params.bnrs == 'Y' ){
					// Reload banners + counters
					mailru.Banners.View.reload();
				}


				var Data = Result.getData();

				this.radar(Request.isAjax ? 'ajax' : 'iframe', 1)('processing');


				if( mailru.v2 && (Result.build !== void 0) ){
					mailru.needReloadPage('build', Result.build);
				}


				if( !this.disabled && Result.isOK() ){
					if( mailru.threads ){
						mailru.Threads.merge(Data.threads);

						Data = {
							folders_hash:  ajs.now(),
							folders:       mailru.Folders.convertThreads(Data.folders),
							messages_hash: ajs.now(),
							messages:      mailru.Messages.convertThreads(Data.threads)
						};
					}


					// Last updated timestamp
					var cacheKey		= Params.folder+'_'+Params.page+'_'+Params.sortby;
					this.cts[cacheKey]	= Data.cts;

					if (Data.token) {
						mailru.updateToken(Data.token);
					}

					if (Data.tokens) {
						$.extend(mailru.tokens, Data.tokens);
					}

					if (Data.collectors) {
						mailru.collectors = Data.collectors;
					}

					if( Data.folders){
						if( !mailru.isMsgList ){
							// https://jira.mail.ru/browse/MAIL-3736
							ajs.each(mailru.Folders.getAll(), function (oF, nF){
								for( var i = 0, n = Data.folders.length; i < n; i++ ){
									if( (nF = Data.folders[i]) && (oF.Id == nF.Id) && (oF.Messages != nF.Messages || oF.Unread != nF.Unread) ){
										Counter.d(nF.Id > 0 ? 555145 : 555144);
										break;
									}
								}
							});
						}

						this.radar('FOLDERS');

						/** @namespace Data.folders_hash */
						mailru.Folders.set( Data.folders, Data.folders_hash );

						this.radar('FOLDERS', 1);

						if( !Data.messages ){
							// expire cache
							mailru.Messages.set(Params.folder, [], ajs.now());
						}
					}

					if( Data.messages ){
						this.radar('MESSAGES');

						// MAIL-16248
						if ((Data.sortBy === 'd' || mailru.messagesSort === 'd') && $.isArray(Data.messages) && Data.messages.length === 0 && $.isArray(Data.folders)) {
							var folder;
							$.each(Data.folders, function (k, v) {
								var next = true;
								if (v.Id == Params.folder) {
									folder = v;
									next = false;
								}
								return next;
							});
							if (folder && folder.Messages) {
								Data.sortBy = 'D';
								this.__sortby = null;
								this.cts = {};
							}
						}

						/** @namespace Data.messages_hash */
						mailru.messagesSort	= Data.sortBy;
						mailru.Messages.set(Params.folder, Data.messages, Data.messages_hash, 0);

						this.radar('MESSAGES', 1);

						/** @namespace mailru.browserNotification */
						if( ajs.blurred && mailru.browserNotification && Jinn.hasRight() ){
							var
								  ts = store.get('last_message_ts')
								, list = ajs.filter(Data.messages, function (msg){ return msg.DateUTS > ts && msg.Unread; })
								, count = list.length
							;

							if( count ){
								//noinspection JSUnresolvedVariable
								var notify = {
									  icon:  mailru.Utils.getAvatarSrc((count == 1 && list[0].SPF) ? list[0].From : 'support@mail.ru', null, 32)
									, title: Lang.get('jinn.new_messages').replace('%s', ajs.plural(count, Lang.get('unread.plural'), ' ') +' '+ ajs.plural(count, Lang.get('Messages').letter))
								};

								if( count == 1 ){
									ajs.extend(notify, {
										  title: replaceEntity(list[0].Subject || Lang.get('message.email.untitled'))
										, text:  Lang.get('jinn.from') + replaceEntity(list[0].FromShort)
									});
								}

								notify = Jinn.say(notify);
								notify.onclick = function (){
									//noinspection JSUnresolvedFunction
									window.focus();
									jsHistory.disabled = jsHistory.disabled || !mailru.isMailboxPage();

									if( count == 1 ){
										jsHistory.set(mailru.getPageURL('readmsg', { id: list[0].Id }));
									}
									else {
										jsHistory.set(mailru.getPageURL('msglist'));
									}

									this.cancel();
								};

								store.set('last_message_ts', list[0].DateUTS);
								mailru.Messages.getSafe(list[0].Id).jinnNotify = notify;
							}
						}
					}

					if (callback) {
						callback(Data);
					}
				}
				else if( Result.isAccessDenied() ){
					/** @namespace Data.section */
					if( Data && Data.section == 'folder'  )
						mailru.Events.fire('accessdenied.folder', Params.folder);
				}
				else if( Result.isError() ){
					// ERROR
					ajs.sleep(function (){
						var View = mailru.View.Messages.getActive();
						if( View ) View.statusLine(Result);
					}.bind(this), 10);
				}

				documentView.redraw();

				mailru.Events.fire('stop.updater');

				// Disabled by RubaXa
				//this.radar('processing', 1)('all', 1)(true);
			}

			delete this.Request[id];
		},

		_abort: function(R){
			if( R === undef ) R = this.Request[this.idx];

			if( R ){
				var tr = R.transport;

				if( tr ){
					if( R.isAjax ) {
						tr.abort();
					}
					else {
						try {
							var win	= tr.contentWindow;
							if( win ){
								if( 'stop' in win ) win.stop();
								else if( win.document ) win.document.execCommand('Stop');
							}
						}
						catch (er) {}

						$(tr).delay(0).queue(function(){ $(this).remove(); });
					}
				}

				R.transport = null;
				delete R.transport;
				clearTimeout(R.timeout);
			}
		},


	// @public
		abort: function (){
			try { this._abort(); } catch (e){}
			this.idx++;	// ?!?!
		},

		stop: function (force){
			if( force ){
				this.abort();
			}
			if( !this.disabled ) this.stopCnt = 1; else this.stopCnt++;
			this.disabled	= true;
		},

		start: function (reload, data){
			this.stopCnt	= Math.max(0, this.stopCnt - 1);
			this.disabled	= this.stopCnt > 0;
			if( reload ) this.reload(true, data);
		},

		reload: function (force, data){
			if( !this.disabled ){
				if( force || (ajs.now() - this.lastTS > 30000) ){
					this.lastTS	= ajs.now();
					this.active	= true;
					this.radar('clear')('all')(force ? 'iframe' : 'ajax');

					clearTimeout(this._timeId);
					this._timeId = setTimeout(function (){
						 mailru.Updater._request( ++mailru.Updater.idx, data || {}, force )
					}, 50);
				}
			}
		}

	}; // Updater


	jsLoader.loaded('{mailru}mailru.Updater', 1);

// data/ru/images/js/ru/mailru.Updater.js end

// data/ru/images/js/ru/mailru.Layers.js start

/**
 * @object	mailru.Layers
 * @author	RubaXa	<trash@rubaxa.org>
 */


// data/ru/images/js/ru/jsCore/jquery/addressbookSuggest.js start


// data/ru/images/js/ru/utils/mailru.Utils.Addressbook.js start


"use strict";

	var data;
	var contactsFromAPI;
	var searchIndex;
	var emailsMap;
	var lastChange = 0;
	var $window = $(window);
	var NEED_LOADING_CONTACTS_VIA_API =// mail-13817
		!(mailru.userdomain in {
			"mail.ru": null
			, "my.com": null
			, "bk.ru": null
			, "list.ru": null
			, "inbox.ru": null
			, "mail.ua": null
		})
	;

	function updateCache() {
		lastChange++;

		if( searchIndex === void 0 ) {
			var options = $E({}, $.Autocompleter.defaults, {
				data: data,
				'multiple': true,
				'matchContains': 'word',
				'cacheLength': 1000,
				'multipleSeparatorPattern': /(?:\s)?[,;](?:\s)?/g,
				'rawList' : true
			});

			options.formatMatch = options.formatMatch || options.formatItem;

			searchIndex = $.Autocompleter.Cache(options);
			searchIndex.populate();
		}
	}

	function _mapRowValue(row) {
		return row.value;
	}

	var facadeObject = {
		find: function(query) {
//				return cache[sortBy].searchIndex.find(query);
			return Array.map(searchIndex.load(query), _mapRowValue);
		},

		all: function() {
			return data;
		},

		existsEmail: function(email) {
			return emailsMap[email] !== undefined;
		},


		tokenizer: function(str) {
			return mailru.Utils.Search.queryToTokens(str.replace(/[<>]/g, ''));
		}
	};

	function getFacade(callback) {
		if( $.isFunction(callback) ) {
			updateCache();
			callback(facadeObject);
		}
	}

	function isLoaded() {
		return Array.isArray(data);
	}

	function apiContactToPlainContacts(array, contact, emailsMap) {
		var contactName = contact.name
			, emails = contact.emails
			, email
		;

		contactName = contactName && ((contactName.first || "") + " " + (contactName.last || "")).trim() || contact.nick || "";

		if( emails ) {
			for(var i = 0, l = emails.length ; i < l ; i++ ) {
				email = emails[i];
				if( !(email in emailsMap) ) {
					emailsMap[email] = null;
					array.push(contactName ? contactName + " <" + email + ">" : email)
				}
			}
		}
	}

	function combineDataAndCreateEmailsMap(data, apiData) {
		emailsMap = {};

		var item, i, l;

		if( Array.isArray(data) ) {
			for( i = 0, l = data.length ; i < l ; i++ ) {
				item = data[i];

				if( !item ) {
					continue;
				}

				if( item.charAt(0) == '"' ) {
					item = item.replace(/"/g, '');
				}

				if( item.indexOf('<') !== -1 ) {
					item = item.match(/<([^>]+)>/)[1];
				}

				emailsMap[item] = null;
			}
		}
		else {
			data = [];
		}

		if( Array.isArray(apiData) ) {
			for( i = 0, l = apiData.length ; i < l ; i++ ) {
				apiContactToPlainContacts(data, apiData[i], emailsMap);
			}
		}

		return data;
	}

	function loadData(afterLoad) {
		mailru.Utils.getAddressBook(function(firstParam, response) {
			data = combineDataAndCreateEmailsMap(response, contactsFromAPI);

			contactsFromAPI = null;//We don't need this cache any more

			if( $.isFunction(afterLoad) ) {
				afterLoad();
			}
		});
	}

	mailru.Utils.Addressbook = function(callback) {
		if( isLoaded() ) {
			getFacade(callback);
		}
		else {
			// mail-13817
			// Subscribe on API contacts changes
			if( NEED_LOADING_CONTACTS_VIA_API ) {
				getContacts(function (error, contacts) {
					if( !error ) {
						contactsFromAPI = contacts;
						if( isLoaded() ) {
							loadData();
							searchIndex = void 0;
							updateCache();
						}
						$window.triggerHandler('addressbook:update');
					}
				}, {subscribe: true});
			}

			loadData(getFacade.bind(null, callback));
		}
	};

	mailru.Utils.Addressbook.getLastChange = function() {
		return lastChange;
	};


	$window.bind("abjs:updated", function() {//MAIL-14676
		if( isLoaded() ) {
			loadData();
			searchIndex = void 0;
			updateCache();
			$window.triggerHandler('addressbook:update');
		}
	});

	var getContacts = NEED_LOADING_CONTACTS_VIA_API && (function () {// mail-13817
		var CONTACTS_FORMAT_VERSION = 1
			, contactsCache
			, _isInAjax
			, updateCallbacks = []
			, Contacts = {}
			, API_URL = "ab/contacts/common"
			, API_KEY = mailru.useremail + "|" + API_URL
		;

		function getContactsFromLocalStore() {
			if( store.get(API_KEY + ":version") == CONTACTS_FORMAT_VERSION ) {
				return store.get(API_KEY);
			}
			return null;
		}

		function saveContactsToLocalStore(contacts) {
			try {
				store.set(API_KEY + ":version", CONTACTS_FORMAT_VERSION);
				store.set(API_KEY, contacts);
			}
			catch(e) {}
		}

		function responseNewContacts( response ) {
			var data = {};

			data.body = response.body;
			data.last_modified = response.last_modified;

			saveContactsToLocalStore(data);

			return data;
		}

		function _reduce_arrayToObject(value, item) {
			value[item.id] = item;

			return value;
		}

		function responseContactsDiff( previousContacts, response ) {
			var data = previousContacts.body
				, deleted = response.body.deleted
				, modified = response.body.modified
			;

			if( deleted && deleted.length ) {
				deleted = Array.reduce(deleted, _reduce_arrayToObject, {});
			}
			else {
				deleted = null
			}
			if( modified && modified.length ) {
				modified = Array.reduce(modified, _reduce_arrayToObject, {});
			}
			else {
				modified = null
			}

			if( deleted || modified ) {
				data = Array.reduce(data, function(value, item) {
					if( deleted && item.id in deleted ) {

					}
					else if( modified && item.id in modified ) {
						value.push(modified[item.id]);
					}
					else {
						value.push(item);
					}

					return value;
				}, []);
			}
			else {
				return false;
			}

			previousContacts.body = data;
			data = previousContacts;
			data.last_modified = response.last_modified;

			saveContactsToLocalStore(data);

			deleted = modified = null;

			return data;
		}

		function _clearContactsCache() {
			if( _clearContactsCache.tid ) {
				clearTimeout(_clearContactsCache.tid);
			}

			// Cache live only two minutes
			_clearContactsCache.tid = setTimeout(function() {
				_clearContactsCache.tid = contactsCache = null;
			}, 120000);
		}

		function apiResponse(response) {
			var data
				, error = null
				, callback
			;

			if( response.status == "200" ) {
				if( Array.isArray(response.body) ) {
					// In this case last_modified is too old, so server shipping a full contacts list but not a diff
					data = responseNewContacts(response);

					//console.log("new contacts")
				}
				else if( Object.isObject(response.body) && contactsCache ) {
					data = responseContactsDiff(contactsCache, response);

					//console.log("diff contacts")
				}
				else {
					jsCore.error(error = "Something went wrong during Contacts loading");
				}
			}
			else {
				jsCore.error(error = "Can't load Contacts")
			}

			if( !error && data !== false ) {
				contactsCache = data;

				for(var i = 0, len = updateCallbacks.length ; i < len ; i++ ) {
					callback = updateCallbacks[i];

					callback.call(null, error, contactsCache.body);
					if( callback.once ) {
						// Delete non-subscribing callbacks
						updateCallbacks = updateCallbacks.splice(1, i);
						// decrement counter and cached array length
						i--;
						len--;
					}
				}
			}
		}

		/**
		 *
		 * @public
		 * @param {function(string: error, Object: data)} fn
		 * @param {Object} options
		 */
		return function (callback, options) {
			var fnIsFunc = $.isFunction(callback)
				, error = null
				, data
				, url
				, needSubscribe
			;

			if( !contactsCache ) {
				// try get cache from localStorage
				contactsCache = getContactsFromLocalStore();
			}

			if( contactsCache ) {
				// set timer to cleanup cache after two minutes
				_clearContactsCache();
			}

			if( fnIsFunc ) {
				if( options ) {
					if( !(needSubscribe = options.subscribe) ) {
						callback.once = true;
					}
					if( options.asObjects ) {
						callback.asObjects = true;
					}
				}

				if( !contactsCache || options.subscribe ) {
					// No localStorage stored data
					needSubscribe = true;
				}
				if( contactsCache ) {
					// Has localStorage stored data - call callback immediately
					callback(error, contactsCache.body);

					if( !options.subscribe ) {
						needSubscribe = false;
					}
				}

				if( needSubscribe ) {
					updateCallbacks.push(callback);
				}
			}

			if( !_isInAjax ) {
				// First API contacts request - send request to server
				_isInAjax = true;

				url = API_URL;

				if( contactsCache ) {
					// Has localStorage stored data - send diff request
					data = {
						last_modified: contactsCache.last_modified
					};
					url += '/diff';
				}

				mailru.API({
					url: url,
					data: data,
					complete: apiResponse
				});
			}
		};
	})();

	jsLoader.loaded('{mailru.utils}mailru.Utils.Addressbook', 1);

// data/ru/images/js/ru/utils/mailru.Utils.Addressbook.js end

(function($) {
		var RE_EMAIL = /([\w.а-яё\-+]+)@([\w.а-яё\-]+)\.[\wа-яё]+/
			, RE_NAME_AND_EMAIL_IN_LTGT = new RegExp("[\"']?(.*?)[\"']?\\s+(?:<|&lt;)(" + RE_EMAIL.source + ")(?:>|&gt;)")
			, RE_LAST_WORDS =  /^.*,\s*/
			, RE_SEPARATOR = /,\s*/g
			, RE_COMMA_ON_END = /,\s*$/
			, RE_COMMA_ON_START = /^\s*,/
			/** @const */
			, INPUT_EVENT_NAME = "oninput" in document ? "input" : "keyup"
		;

		var namespace = 'addressbookSuggest' + $.expando;

		var stat = {
			startSearchTS: 0,
			startSelectionTS: 0,

			waitSelection: null,
			waitFail: null,

			requestValue: '',
			suggestValue: '',

			sourceSize: 0,
			suggestsList: [],

			log: function(val, idx){
				if(this.startSearchTS){
					clearTimeout(this.waitSelection);
					clearTimeout(this.waitFail);

					mailru.Utils.suggestLog('email', {
						  start_ts: this.startSearchTS
						, sel_ts:   this.startSelectionTS
						, val:      this.requestValue
						, sel:      val
						, data:     this.suggestsList || []
						, idx:      idx
						, abjs:     this.sourceSize
					});

					delete this.requestValue;
					delete this.startSearchTS;
					delete this.startSelectionTS;
					delete this.suggestsList;
				}
			},

			autoLog: function(type, timeout) {
				this[type] = setTimeout(function() {
					this.log('')

				}.bind(this), timeout);
			}
		};

		function _getOpts(params) {
			var opts = {
				  width: '322px'
				, searchLast: true
				, findLastWord: RE_LAST_WORDS
				, autosubmit: false
				, showInternet: false
				, internalSource: true
				, minLength: 1
				, timeout: 0
				, multiSuggests: true
				, suggestEscapeStart: '"'
				, suggestEscapeEnd: '"'
				, suggestSeparator: RE_SEPARATOR
				, selectByTab: true
				, cnSuggest:  'addressbook__suggest__block'
				, cnList:     'addressbook__suggest__list'
				, cnItem:     'addressbook__suggest__item'
				, cnSelected: 'addressbook__suggest__item_selected'
				, cnItemTick: 'addressbook__suggest__item__tick'
				, cnInput:    'addressbook__suggest__input'
				, useCache: false
				, fetching: true
				, limit: 0
				, undeterminedStage: false
				, ignoreUsedData: true
				, onlyEmailAfterSelect: false
				, deleteLastComma: false

				, template: function (val, item, index, data, originalVal){
					var nameAndEmail_parts = item.match(RE_NAME_AND_EMAIL_IN_LTGT)
						, tick = mailru.Utils.Search.highlightReplace(originalVal, '<b class="addressbook__suggest__item__tick">', '</b>')
						, avatar = nameAndEmail_parts && mailru.Utils.getAvatarSrc(nameAndEmail_parts[2], nameAndEmail_parts[1], 32)
					;

					return "<div data-suggest='" +  ajs.$.quote( ajs.Html.escape(item) ) + "' class='addressbook__suggest__item' data-suggest-idx=''>" +
						(
							nameAndEmail_parts 
								? tick(nameAndEmail_parts[1]) +
									' <span class="addressbook__suggest__item__hint">' +
										tick(nameAndEmail_parts[2]) +
									'</span>'

								: tick(item)
						) +
						(avatar ? '<img alt="" class="addressbook__suggest__item__image" src="' + avatar + '" />' : '') +
					'</div>'
				}
				, onselect: function(e) {
					var opts = this["opts"]
						, selectedValue
					;

					if( opts && opts["onlyEmailAfterSelect"] ) {
						selectedValue = e["newSuggest"];
						if( selectedValue = selectedValue.match(RE_NAME_AND_EMAIL_IN_LTGT) ) {
							if( selectedValue[2] ) {
								e["newSuggest"] = selectedValue[2];
							}

						}
					}
				}

			};

			if( Object.isPlainObject(params) ) {
				opts = Object.extend(opts, params);
			}

			if( mailru.isAncientBrowser() ) {
				opts.limit = 100;
				delete opts.fetching;
			}

			// позиционирование блока с саджестами
			opts.margin = mailru.IsNewComposeDesign ? 7 : 3;

			return opts;
		}

		var isLoading = false;



		function _suggestToEmail(str) {
			var  nameAndEmail_parts = str.match(RE_NAME_AND_EMAIL_IN_LTGT);
			return nameAndEmail_parts ? nameAndEmail_parts[2] : str;
		}
		function _getSuggestWords_after(suggestWords) {
			return Array.filter(
				Array.map(suggestWords, function(str) {
					return _suggestToEmail(str);
				})
				, function(str) {
					return $.trim(str).length > 0;
				}
			);
		}

		$.fn.addressbookSuggest = function(param) {
			if(param === 'widget') {
				return this.data(namespace);

			} else {
				return this.each(function() {
					var addressbookData;
					var _addressbookLastChange;
					var $input = $(this);

					var opts = _getOpts(param);

					// у скрытых инпутов неправильная ширина
					if($input.is(':visible')) {
						// установка ширины саджестов
						var inputWidth = $input.width();

						if(inputWidth < 322) {
							opts.width = (inputWidth - 2) + 'px';
						}
					}

					var suggest = new mailru.ui.Suggest($input, [], Object.extend(opts, {
						cnInput: $input[0], // корректная ссылка на текущий элемент
						afterSelect: function(value, idx, leftPart, rightPart) {
							if( opts.multiSuggests ) {
								stat.log(value, idx);

								if( !rightPart
									|| !RE_COMMA_ON_START.test(rightPart)
								) {
									return value + ", ";
								}
							}
							return value;
						},
						afterGetSuggestWords: _getSuggestWords_after,
						ignoreUserData: true,

						afterGetData: function(triggerEvent) {
							var data = triggerEvent["data"];

							if( !data || data.length === 0 )return;

							// заполнение статистики перед выдачей саджестов
							stat.requestValue = triggerEvent["findValue"];
							stat.suggestsList = data;
							stat.sourceSize = addressbookData ? addressbookData.all().length : 0;

							clearTimeout(stat.waitSelection);
							clearTimeout(stat.waitFail);

							if( data.length == 0 ) {
								// пишем в лог fail, если ничего не нашли в течении 0,5s
								stat.autoLog('waitFail', 500);

							} else {
								stat.startSelectionTS = ajs.now();

								// пишем в лог, если пользователь ничего не выбрал в течении 15s
								stat.autoLog('waitSelection', 15000);
							}
						},

						filterUsed: function(data, usedMap) {
							var filteredData = [];

							for(var i=0, l=data.length; i<l; i++) {
								var row = data[i];

								var key = _suggestToEmail(row);

								if(usedMap[key] === undefined) {
									filteredData.push(row);
								}
							}

							return filteredData;
						},

						startFindSuggest: addCommaToInput
					}));

					$(window).bind('addressbook:update', function() {
						addressbookData = null;

						if( suggest.isExpanded() ) {
							setDataSource();
							suggest.rebuildSuggestsList();
						}
					});

					function setDataSource(callback) {
						if( !addressbookData
							|| mailru.Utils.Addressbook.getLastChange() != _addressbookLastChange
						) {
							mailru.Utils.Addressbook(function (data) {
								_addressbookLastChange = mailru.Utils.Addressbook.getLastChange();

								addressbookData = data;

								suggest.setData(data);

								if($.isFunction(callback)) {
									callback();
								}
							});
						}
						else {
							if($.isFunction(callback)) {
								callback();
							}
						}
					}

					function addCommaToInput(event) {
						if( opts.multiSuggests ) {
							// если в поле ввода, что то есть
							// то пишем туда запятую, чтобы корректно добавлять
							// новые элементы из списка
							var value = $input.val()
								, caret
							;

							if( event
								&& event.type == "focus"
							) {
								caret = ajs.$.getCaretPosition($input[0]);
								if( caret.end != value.length ) {
									return;
								}
							}

							value = $.trim(value);

							if(value && !value.match(RE_COMMA_ON_END)) {
								$input.val(value += ", ");
								ajs.$.setCaretPosition($input[0], value.length + 1);
							}
						}
					}
					$input
						.data(namespace, {
							getUsed: function(ignoreAfterGetSuggestWords) {
								return suggest.getSuggestWords(ignoreAfterGetSuggestWords);
							}
						})

						.bind('focus', addCommaToInput)

						.bind('keydown', function(e) {
							// отключение вставки переносов строк в поле с адресами
							if (!e.ctrlKey && e.keyCode == 13) {
								e.preventDefault();
							}

							// сброс статистики по выделению
							clearTimeout(stat.waitSelection);
							if(!stat.startSearchTS) {
								stat.startSearchTS = ajs.now();
							}
						})

						.bind('keyup', opts.ignoreUsedData ? function(e) {
							// пересчитываем использованные адреса, чтобы учесть пользовательские правки
							suggest.ignoreUsed(suggest.getSuggestWords());
						} : null)

						.bind('keydown keyup', function(e) {
							// и возвращаем сортировку по приоритетам (если АК была уже загружена с другой сортировкой)
							setDataSource();
						})
					;

					if( opts.deleteLastComma ) {
						$input.bind('blur', function() {//removeCommaFromInput | MAIL-13992
							var value = $.trim($input.val());

							if(value && value.match(RE_COMMA_ON_END)) {
								$input.val(value.replace(RE_COMMA_ON_END, ""));
								$input.trigger(INPUT_EVENT_NAME);
							}
						});
					}

					if(!isLoading) {
						setDataSource();
						isLoading = true;
					}
				})
			}
		};

	})(jQuery);

	jsLoader.loaded('{jQuery}addressbookSuggest', 1);

// data/ru/images/js/ru/jsCore/jquery/addressbookSuggest.js end

// data/ru/images/js/ru/jsCore/jquery/composeLabels.js start


// data/ru/images/js/ru/ui/mailru.ui.ComposeLabels.js start


var   RE_EMAIL = /([\w.а-яё\-+]+)@([\w.а-яё\-]+)\.[\wа-яё]+/
		, RE_NAME_AND_EMAIL_IN_LTGT = new RegExp("[\"']?(.*?)[\"']?\\s+(?:<|&lt;)(" + RE_EMAIL.source + ")(?:>|&gt;)$")
		, RE_SEPARATOR = /,\s*/g
		;

	var   htmlEscape = ajs.HTML.escape
		//, htmlUnescape = ajs.HTML.unescape
		;

	var stat = {
		startSearchTS: 0,
		startSelectionTS: 0,

		waitSelection: null,
		waitFail: null,

		requestValue: '',
		suggestValue: '',

		sourceSize: 0,
		suggestsList: [],

		log: function(val, idx){
			if(this.startSearchTS){
				clearTimeout(this.waitSelection);
				clearTimeout(this.waitFail);

				mailru.Utils.suggestLog('email', {
					start_ts: this.startSearchTS
					, sel_ts:   this.startSelectionTS
					, val:      this.requestValue
					, sel:      val
					, data:     this.suggestsList || []
					, idx:      idx
					, abjs:     this.sourceSize
				});

				delete this.requestValue;
				delete this.startSearchTS;
				delete this.startSelectionTS;
				delete this.suggestsList;
			}
		},

		autoLog: function(type, timeout) {
			this[type] = setTimeout(function() {
				this.log('');

			}.bind(this), timeout);
		}
	};

	function _getOpts() {
		var opts = {
			width: '250px'
			, searchLast: true
			, autosubmit: false
			, showInternet: false
			, internalSource: true
			, minLength: 1
			, timeout: 0
			, multiSuggests: true
			, suggestEscapeStart: '"'
			, suggestEscapeEnd: '"'
			, suggestSeparator: RE_SEPARATOR
			, selectByTab: true
			, cnSuggest:  'addressbook__suggest__block'
			, cnList:     'addressbook__suggest__list compose__labels__suggest'
			, cnItem:     'addressbook__suggest__item'
			, cnSelected: 'addressbook__suggest__item_selected'
			, cnItemTick: 'addressbook__suggest__item__tick'
			, cnInput:    'addressbook__suggest__input'
			, fetching: true
			, limit: 0
			, undeterminedStage: false
			, ignoreUsedData: true
			, isLoading: false
			, blockMaxWidth: 0
			, suggestMaxExcess: 30
			, dragNDropEnabled: false

			, template: function (val, item, index, data, originalVal){
				var nameAndEmail_parts = item.match(RE_NAME_AND_EMAIL_IN_LTGT)
					, tick = mailru.Utils.Search.highlightReplace(originalVal, '<b class="addressbook__suggest__item__tick">', '</b>')
					, avatar = nameAndEmail_parts && mailru.Utils.getAvatarSrc(nameAndEmail_parts[2], nameAndEmail_parts[1], 32)
					;

				return "<div data-suggest='" +  ajs.$.quote( htmlEscape(item) ) + "' class='addressbook__suggest__item' data-suggest-idx=''>" +
					(
						nameAndEmail_parts
							? '<div class="addressbook__suggest__item__text">' +
							tick(nameAndEmail_parts[1]) +
							' </div><span class="addressbook__suggest__item__hint">' +
							tick(nameAndEmail_parts[2]) +
							'</span>'

							: '<div class="addressbook__suggest__item__text">' +
							tick(item) +
							'</div>'
						) +
					(avatar ? '<img alt="" class="addressbook__suggest__item__image" src="' + avatar + '" />' : '') +
					'</div>'
			}

		};

		if( mailru.isAncientBrowser() ) {
			opts.limit = 100;
			delete opts.fetching;
		}

		// позиционирование блока с саджестами
		opts.margin = 7;

		return opts;
	}

	function isCtrlKey(e) {
		return e.ctrlKey || e.metaKey;
	}

	/**
	 * Check keycode that it is a letter or a number or some punctuation marks and not system keys
	 * @param keyCode
	 */
	function isNotSystemKey (keyCode) {
		return keyCode == 32 || (keyCode >= 48 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 111) || keyCode >= 186
	}

	function _hasEmail(str) {
		return !!str.match(RE_EMAIL);
	}

	function _suggestToEmail(str) {
		var  nameAndEmail_parts = str.match(RE_NAME_AND_EMAIL_IN_LTGT);
		return nameAndEmail_parts ? nameAndEmail_parts[2] : str;
	}

	function _suggestToName(str) {
		var  nameAndEmail_parts = str.match(RE_NAME_AND_EMAIL_IN_LTGT);
		return nameAndEmail_parts ? nameAndEmail_parts[1] : str;
	}

	/**
	 * @class mailru.ui.ComposeLabels
	 */
	jsClass
		.create('mailru.ui.ComposeLabels')
		.methods({
			__construct: function(input, param, namespace, opts) {
				this.opts = Object.extend({}, _getOpts(), opts);
				this.namespace = namespace;

				this._prepareContainer($(input));
				this._initSuggests();
				this._initHandlers();
				this._initWidget();
				this._initLabels();
				this._initHistory();
				this._initDragNDrop();

				ajs.log('mailru.ui.ComposeLabels ready');
			},


			_prepareContainer: function($donor) {
				// переделываем инпут в контейнер, а в нем уже лежит все, что нам надо.

				// заменяем инпут на скрытый
				this.$source = $('<input type="hidden">')
					.attr({
						'name': $donor.attr('name')
						, 'id': $donor.attr('id')
						, 'class': 'js-source'
					})
					.val( $donor.val() );
				this.source = this.$source[0];

				// инпут, в котором будем печатать
				this.$input = $('<input type="text">')
					.attr({
						'tabindex': $donor.attr('tabindex')
						, 'data-original-name': $donor.attr('name')
						, 'class': 'js-input compose__labels__input'
					});
				this.input = this.$input[0];

				// лейбл
				var $label = $('<span></span>')
					.attr({
						'tabindex': $donor.attr('tabindex')
						, 'class': 'js-compose-label compose__labels__label'
						, 'style': 'display: none;' + (this.opts.blockMaxWidth ? ' max-width: ' + (this.opts.blockMaxWidth + 17) + 'px;' : '')
					})
					.append($('<span></span>')
						.attr({
							'class': 'compose__labels__label__text js-label-text',
							'style': (this.opts.blockMaxWidth ? 'max-width: ' + this.opts.blockMaxWidth + 'px;' : '')
						}))
					.append($('<i></i>')
						.attr({
							'class': 'icon icon_compose_label_close js-remove-label'
						}));

				// ксерокс
				// если надо скопировать несколько лейблов, то подставляем их отформатированное
				// содержимое сюда и передаем ему фокус, браузер сделает дальше все сам.
				this.$xerox = $('<input type="text"/>')
					.attr({
						'tabindex': -1
					})
					.css({
						'overflow': 'hidden',
						'position': 'absolute',
						'marginLeft': -10000,
						'marginTop': -10000,
						'width': 'auto'
					});

				// пересобираем:
				// контейнер вместо инпута
				$donor.replaceWith(this.$container = $('<div></div>')
					.attr({
						'class': $donor.attr('class')+' compose__labels',
						'style': 'height: auto;'
					})
					.addClass('js-compose-labels'));

				// добавляем лейбл, инпут и скрытый инпут
				this.$container.append($label, this.$input, this.$source, this.$xerox);
				// готово!
			},

			_initLabels: function() {
				// создаем лейблы из исходной строки
				this.$input.val(this.$source.val());

				var words = this.suggest.getSuggestWords();

				if (words.length) {
					Array.forEach(words, this._createLabel.bind(this));
				}
			},

			_initSuggests: function() {
				var t = this;

				// у скрытых инпутов неправильная ширина
				if(this.$input.is(':visible')) {
					// установка ширины саджестов
					var inputWidth = this.$input.width();

					if(inputWidth < 250) {
						this.opts.width = Math.max((inputWidth - 2), 220) + 'px';
					}
				} else {
					this.opts.width = 220 + 'px'; //default
				}

				this.suggest = new mailru.ui.Suggest(this.$input, [], Object.extend(this.opts, {
					cnInput: this.input, // корректная ссылка на текущий элемент
					afterSelect: function(value, idx) {
						stat.log(value, idx);

						// удаляем лишнюю метку (она создалась по blur)
						t._removeDuplicate(t.$input.val());
						// создаем метку из саджеста
						t._createLabel(value);
						t._prepareInput();

						return '';
					},
					//afterGetSuggestWords: t._getSuggestWords_after.bind(this),
					ignoreUserData: true,

					afterGetData: function(triggerEvent) {
						var data = triggerEvent["data"];

						if( !data || data.length === 0 )return;

						// заполнение статистики перед выдачей саджестов
						stat.requestValue = triggerEvent["suggestValue"];
						stat.suggestsList = data;
						stat.sourceSize = t.addressbookData ? t.addressbookData.all().length : 0;

						clearTimeout(stat.waitSelection);
						clearTimeout(stat.waitFail);

						if( data.length == 0 ) {
							// пишем в лог fail, если ничего не нашли в течении 0,5s
							stat.autoLog('waitFail', 500);

						} else {
							stat.startSelectionTS = ajs.now();

							// пишем в лог, если пользователь ничего не выбрал в течении 15s
							stat.autoLog('waitSelection', 15000);
						}
					},

					filterUsed: function(data, usedMap) {
						// отбрасываем уже добавленные саджесты
						var filteredData = [];

						for(var i=0, l=data.length; i<l; i++) {
							var row = data[i];

							var key = _suggestToEmail(row);

							if(usedMap[key] === undefined) {
								filteredData.push(row);
							}
						}

						return filteredData;
					},

					afterRebuild: function(e, $block) {
						// проверяем, не вышел ли блок за край
						var max = t.$container.offset().left + t.$container.width() + t.opts.suggestMaxExcess;
						if ($block.offset().left + $block.width() > max) {
							$block.css({left: Math.max(max - $block.width(), t.$container.offset().left)})
						}
					}
				}));

				if(!this.opts.isLoading) {
					this._setDataSource();
					this.opts.isLoading = true;
				}
			},

			_initHandlers: function() {
				var t = this;
				// здесь подписываемся на события мыши и клавиатуры

				// ******************** input ********************
				this.$input
					.bind('blur', function() {
						// при потере фокуса создаем из инпута лейбл
						ajs.log('blur, noblur ',t.opts.noblur, ' value ',this.value);
						if (t.opts.noblur) {
							t.opts.noblur = false;
						}
						else {
							t._createLabel(this.value);
							this.value = '';
						}
					})

					.bind('keydown', function(e) {
						var keyCode = e.keyCode
							, caret = ajs.$.getCaretPosition(this);

						if (keyCode == 13 || keyCode == 27) { //  enter или escape
							if ( !t.suggest.isExpanded() ) { // открытые саджесты сами отработают эти кнопки
								t._createLabel(this.value);
								t._prepareInput();
								e.preventDefault();
							}
						}
						else if ( ((keyCode == 37 || keyCode == 8) && (!caret.start && !caret.end)) || (e.shiftKey && keyCode == 9)) {
							// left или backspace в начале строки
							// или shift+tab
							var $prev = t._getPrevLabel(t._getInputWrap());
							if($prev.length) {
								if (mailru.ComposeLabelsOneClick && keyCode == 8) {
									// по backspace просто удаляем предыдущий лейбл
									t._removeLabel($prev);
								} else {
									// уходим из инпута и выделяем предыдущий лейбл
									$(this).blur();
									$prev.click();
								}
								e.preventDefault();
							}
						}
						else if ( (keyCode == 39 && caret.start == this.value.length) || keyCode == 9) { // right или tab
							var $next = t._getNextLabel(t._getInputWrap());
							if ($next.length) {
								// уходим из инпута и выделяем следующий лейбл
								$(this).blur();
								$next.click();
								e.preventDefault();
							}
							else if (this.value != '') {
								// если инпут непустой, то создаем лейбл и ставим курсор в новый
								t._createLabel( this.value );
								t._prepareInput();
								e.preventDefault();
							}
						}
						else if (isCtrlKey(e) && keyCode == 65 && this.value == '') { // ctrl+a
							//  на пустом тексте выделяем все лейблы
							t._selectAllLabels();
							e.preventDefault();
						}
						else if (isCtrlKey(e) && this.value == '' && (keyCode == 90 || keyCode == 89 )) { // ctrl+z, ctrl+y undo/redo
							var memento = (keyCode == 90) ? t.history.undo() : t.history.redo();
							if (memento !== null) {
								t.$source.val(memento);
								// clear current
								t._removeAllLabels();
								// init new
								t._initLabels();
								t._prepareInput();
							}
							e.preventDefault();
						}
						else if (_hasEmail(this.value) && (keyCode == 32 || this.value.slice(-1) == '>')) {
							// если введен емейл в угловыми скобками, то после него по любой букве схлопываем
							// а если емейл без скобок но нажали на пробел, то все равно схлопываем
							if (caret.start == this.value.length && isNotSystemKey(keyCode)) {
								t._createLabel( this.value );
								t._prepareInput();
								if (keyCode == 32)
									e.preventDefault();
							}
						}

						// скрыть тултипы, если они есть
						t._hideTooltip(true);

						// сброс статистики по выделению
						clearTimeout(stat.waitSelection);
						if (!stat.startSearchTS) {
							stat.startSearchTS = ajs.now();
						}
					})

					.bind('keyup', function() {
						if (t.opts.ignoreUsedData) {
							// пересчитываем использованные адреса, чтобы учесть пользовательские правки
							t.suggest.ignoreUsed(t._getSuggestWords());
						}

						if (this.value == '') {
							// если все стерли, то крестик больше не нужен
							t._prepareInput();
						}

						// обновляем ширину инпута
						t._updateInputWidth();
					})

					// если вставили текст содержащий запятые, то его нужно разбить на метки и вернуть фокус в инпут
					.bind('input', function() {
						if(this.value.match(/,/)) {
							var words = t.suggest.getSuggestWords();

							if (words.length > 1 || this.value.slice(-1).match(RE_SEPARATOR)) {
								// адресов действительно несколько или запятая последняя
								// т.о. мы исключаем запятые в имени пользователя
								this.value = '';
								Array.forEach(words, function(str) {
									if (str) {
										t._createLabel(str);
									}
								});
								t._prepareInput();
							}
						}
						// обновляем ширину инпута
						t._updateInputWidth();
					})

					.bind('focus', function() {
						// если саджестов еще нет, надо их получить
						if (!t.addressbookData) {
							t._setDataSource();
						}
					});


				// ******************** labels ********************
				this.$container
					.bind('click', function(e) {
						// в зависимости от таргета делаем:
						var   $target = $(e.target)
							, $label = $target.closest('.js-compose-label');

						if ($target.is('.js-remove-label') && !isCtrlKey(e) && !e.shiftKey) {
							// удаляем лейбл
							t._removeLabel($label);
							t._prepareInput();
							e.preventDefault();
						}
						else if ($label.length)  {
							// выделение на лейбл
							if (isCtrlKey(e)) {
								if ($label.hasClass('compose__labels__label_selected')) {
									// убираем выделение
									t._deselectLabel($label);
								}
								else {
									// добавляем к выделенным
									t._selectLabel($label, true);
								}
							}
							else {
								t._selectLabel($label);
							}
							e.preventDefault();
						}
						else if (e.target != t.input) {
							// клик в пустое место = редактирование нового
							t._prepareInput();
						}
					});

				// события клавиатуры
				/// самое интересное
				this.$container
					.bind('keydown', function(e) {
						// на инпут свой обработчик
						if (e.target == t.input)
							return;

						var   keyCode = e.keyCode
							, $selectedLabel = t._getSelectedLabel()
							, $label;

						if (keyCode == 37 || keyCode == 39 || keyCode == 9) { // left, right, tab
							// selection
							var   multiple =  e.shiftKey && (keyCode == 37 || keyCode == 39) // shift+стрелки - нужно добавить к выделению
								, isRight = keyCode == 39 || (!e.shiftKey && keyCode == 9); // right, tab - вправо, left, shift+tab - влево

							$selectedLabel = isRight? $selectedLabel.first() : $selectedLabel.last();
							if (multiple)
								$selectedLabel = t.$lastSelectedLabel || $selectedLabel;

							$label = isRight? t._getNextLabel($selectedLabel) : t._getPrevLabel($selectedLabel);

							// выбираем предыдущий следующий
							if ($label.length) {
								if (multiple && $label.hasClass('compose__labels__label_selected')) {
									// возвращаемся на предыдущий выбранный, нужно текущий развыбрать
									t._deselectLabel($selectedLabel);
									t.$lastSelectedLabel = $label;
								}
								else {
									// добавляем к выделению левый или просто выделяем левый
									t._selectLabel($label, multiple);
								}

								e.preventDefault();
							}
							else if (isRight) {
								// фокус в инпут
								t._prepareInput();
								e.preventDefault();
							}
						}
						else if (keyCode == 8 || keyCode == 46) { // backspace, delete
							// удаляем все что выбрано
							if($selectedLabel.length) {
								t._removeLabel($selectedLabel);
								t._prepareInput();
							}
							e.preventDefault();
						}
						else if (keyCode == 27) { // esc
							// сбрасываем выбранные лейблы, начинаем печатать
							t._deselectAllLabels();
							t._prepareInput();
							e.preventDefault();
						}
						else if (keyCode == 13) { // enter
							// редактирование лейбла
							$selectedLabel = t.$lastSelectedLabel || $selectedLabel.last();
							if($selectedLabel.length) {
								t._prepareInput($selectedLabel);
							}
							e.preventDefault();
						}
						else if (isCtrlKey(e) && keyCode == 65) { // ctrl+a
							t._selectAllLabels();
							e.preventDefault();
						}
						else if (isCtrlKey(e) && (keyCode == 67 || keyCode == 88)) { // ctrl+c, ctrl+x
							var text = t._getText($selectedLabel);
							// отдаем фокус в ксерокс, браузер скопирует нужный текст из него
							t.$xerox
								.val(text)
								.focus()
								.select();

							if(keyCode == 88) {
								// вырезаем лейблы
								t._removeLabel($selectedLabel);
							}
						}
						else if (isCtrlKey(e) && (keyCode == 90 || keyCode == 89 )) { // ctrl+z, ctrl+y undo/redo
							var memento = (keyCode == 90) ? t.history.undo() : t.history.redo();
							if (memento != null) {
								t.$source.val(memento);
								// clear current
								t._removeAllLabels();
								// init new
								t._initLabels();
								e.preventDefault();
								t._prepareInput();
							}
						}
						else if ( isNotSystemKey(keyCode) ) { // буква
							// при нажатии на любую букву начинаем ее печатать в новом лейбле
							t._prepareInput();
						}
					});

				// остальное

				// отслеживаем когда не надо создавать лейбл по blur
				// todo: кастомное событие вместо blur
				this.$container.bind('mousedown', function(e) {
					var $target = $(e.target);
					if ($target.is('.js-remove-label') && $target.closest('.js-input-wrap').length) {
						t.opts.noblur = true;
					}
				});
				// тоже не надо блюрить
				this.suggest.block.bind('mousedown', function(e) {
					if (t.suggest.isExpanded())
						t.opts.noblur = true;
					else {
						t.$input.blur(); // это нажатие на тултип, схлопываем что было напечатано.
						t.suggest.block.focus();
					}
				});

				if (!mailru.ComposeLabelsOneClick) { // https://jira.mail.ru/browse/MAIL-14941
					this.$container.delegate('.js-compose-label', 'dblclick', function(e) {
						// редактирование
						t._prepareInput($(e.target).closest('.js-compose-label'));
						e.preventDefault();
					});
				}

				// tooltips
				this.$container
					.delegate('.js-compose-label', 'mouseenter', function(e){
						// при наведении на лейбл показываем тултип
						t._showTooltip($(e.target).closest('.js-compose-label'));
						t.suggest.block
							.bind('mouseenter.tooltip', function(e) {
								// при наведении на тултип нужно его продолжать показывать
								t.suggest.block
									.stop(true)
									.css('opacity','1')
									.show();
								if ($.browser.msie && !t.$input.val())
									t.$input.blur();
							})
							.bind('mouseleave.tooltip', function(e) {
								t._hideTooltip();
							});
					})
					.delegate('.js-compose-label', 'mouseleave', function(){
						// при уведении скрываем тултип
						t._hideTooltip();
					});

				this.$container
					.bind('change', function() {
						// обновляем ширину поля под ширину контейнера
						t.$input.css('max-width',(t.$container.width()-24)+'px');
					})
					.bind('focus', function(evt) {
						t.opts.isActive = true;
					})
					.trigger('change')
				;

				$(document.body).bind('mousedown', function(evt) {
					// сбрасываем выделение при клике наружу
					if(!t.$container.has(evt.target).length && t.opts.isActive) {
						if (t.opts.isActive) {
							t._updateSource();
							t._deselectAllLabels();
							t.opts.isActive = false;
						}
					}
				});

				this.$source
					.bind('focus', function() {
						// когда снаружи пытаются поставить фокус на исходник, который теперь скрытый
						// нам надо перепраить фокус на настоящий инпут
						t._prepareInput();
					})

					.bind('clearPreviousValue change', function() {
						// подписываемся на изменение адресов извне и пересоздаем лейблы
						t._removeAllLabels();
						t._initLabels();
					});
			},

			_initHistory: function() {
				this.history = {
					stack : [],
					pointer : -1,
					checkpoint : function(memento) {
						var   stack = this.stack
							, pointer = this.pointer
							, current = this._getState(pointer);

						if (current !== null) {
							if (memento != current) {
								pointer = ++this.pointer;
								stack.splice(pointer, stack.length - pointer, memento);
							}
						} else {
							stack.push(memento);
							this.pointer++;
						}
//						ajs.log('memento.checkpoint, stack',stack,'pointer',this.pointer);
					},
					undo : function() {
						var prev = this._getState(this.pointer - 1);
						if (prev !== null) {
							this.pointer--;
						}
//						ajs.log('memento.undo, stack',this.stack,'memento',prev,'pointer',this.pointer);
						return prev;
					},
					redo: function() {
						var next = this._getState(this.pointer + 1);
					if (next !== null) {
							this.pointer++;
						}
//						ajs.log('memento.redo, stack',this.stack,'memento',next,'pointer',this.pointer);
						return next;
					},
					_getState: function(i) {
						var stack = this.stack;
						if (i > -1 && i < stack.length)
							return stack[i];
						else
							return null;
					}
				};
				// initial state
				this.history.checkpoint(this.$source.val());
			},

			_initWidget: function() {
				var t = this;
				this.$container.data(this.namespace, {
					getUsed: function() {
						return t._getSuggestWords();
					},

					clear: function() {
						// clear current
						t._removeAllLabels();
						// and source
						t.$source.val('');
					},

					redraw: function() {
						// clear current
						t._removeAllLabels();
						// init new
						t._initLabels();
						// clearCounter
						this.invalidLabelCounted = false;
					},

					isValid: function() {
						// проверим, нет ли невалидных лейблов
						return !t._getLabels().filter('.compose__labels__label_invalid').length;
					}
				})
			},

			// ******* экспорт адресов наружу **************

			_updateSource: function() {
				// заполняем поле всеми созданными лейблами
				var str = this._getText(this._getLabels());
				this.$source.val(str);
				this.$source.trigger('composeLabelsChange');
				// checkpoint
				this.history.checkpoint(str);
			},

			/*
			 * Из массива лейблов достает непустые адреса (полностью с именами) и соединяет их через запятую
			 */
			_getText: function($labels) {
				var texts = [];
				var $label;
				Array.forEach($labels, function(label) {
					$label = $(label);
					if($label.length)
						texts.push($label.data('text') || '');
				});
				texts = Array.filter(texts, function(str) {
					return $.trim(str).length > 0;
				});
				return texts.join(', ');
			},

			_setDataSource: function(callback) {
				var t = this;

				mailru.Utils.Addressbook(function(data) {
					if (!t.addressbookData) {
						t.addressbookData = data;

						t.suggest.setData(data);
					}

					if($.isFunction(callback)) {
						callback();
					}

					t.opts.isLoading = false;
				});
			},

			/*
			 * Из лейблов достает емейлы и возвращает массив
			 */
			_getSuggestWords: function() {
				var   suggestWords = []
					, $label;

				Array.forEach(this._getLabels(), function(label) {
					$label = $(label);
					if ($label.length) {
						suggestWords.push($label.data('text') || '');
					}
				});

				return this._getSuggestWords_after(suggestWords);
			},

			_getSuggestWords_after: function(suggestWords) {
				return Array.filter(
					Array.map(suggestWords, function(str) {
						return _suggestToEmail(str);
					})
					, function(str) {
						return $.trim(str).length > 0;
					}
				);
			},

			/*
			 * Если email есть в адресной книге, скрываем его и оставляем только имя контакта.
			 */
			_suggestToABName: function($label, str) {
				// TODO если мы будем скрывать все емейлы, то нужно убрать все про адресную и переименовать метод

				// т.к. нужно асинхронно запрашивать адресную книгу, то
				// какое-то время лейбл будет с полным адресом, и после загрузки емейл может скрыться
				// в итоге визуально лейблы дернутся и станут меньше
				var email = _suggestToEmail(str)
					, name = str;

				if (email != str) {
					// mail-16444 hide all emails
					/*mailru.Utils.isInAddressBook(email, function(result) {
						if (result) {
							// email есть в адресной книге, скрываем его (если имя не пустое)
							var name = _suggestToName(str).replace(/(^\s+|\s+$)/g, '');

							if (name.length > 0) {
								$label
									.find('.js-label-text')
									.text(name);
							}
						}
					})*/
					name = _suggestToName(str).replace(/(^\s+|\s+$)/g, '');

					if (name.length > 0) {
						$label
							.find('.js-label-text')
							.text(name);
					}
				}

				return name;
			},

			//*********** input **********

			/*
			 * Если лейбл не передали, то ставим инпут в конец и передаем в него фокус
			 * Если передали лейбл, то вставляем инпут внутрь лейбла вместо его текста
			 */
			_prepareInput: function($label) {
				ajs.log('_prepareInput',$label);
				var $input = this.$input;
				if ($label == undefined) {
					var $inputWrap = $input.closest('.js-input-wrap'); // а вдруг до этого мы редактировали

					$input.val('');
					$input.width('auto');
					this.$container.append($input);

					if ($inputWrap.length) {
						// надо удалить пустой и ненужный лейбл
						this._removeLabel($inputWrap, true);
					}
				}
				else {
					// достаем текст
					var $text = $label.find('.js-label-text'),
						text = $label.data('text') || $text.text();

					$input.val( text );
					// заменяем его на инпут
					$text
						.hide()
						.before($input);
					// меняем стили лейбла
					$label
						.removeClass()
						.addClass('js-input-wrap compose__labels__label compose__labels__label_edit');
					if ($label[0].style['max-width']) {
						var currentMaxWidth = $label[0].style['max-width'];
						$label
							.data('max-width', currentMaxWidth)
							.css('max-width',2000);
					}
				}
				this.opts.noblur = true;

				this._deselectAllLabels();
				$input.show();
				this._updateInputWidth();
				this._hideTooltip(true);

				setTimeout(function() { // в некоторых браузерах (ie) фокус не успевает переставиться сразу
					this.opts.noblur = false;
					$input.focus();
					if (mailru.ComposeLabelsOneClick && text) { // https://jira.mail.ru/browse/MAIL-14941
						if (_hasEmail(text)) {
							var name, start, end;
							name = _suggestToName(text);
							start = text.indexOf(name);
							end = start + name.length;
							ajs.$.setCaretPosition(this.input, start, end);
						}
						else {
							ajs.$.setCaretPosition(this.input, 0, text.length);
						}
					}
				}.bind(this), 10);
			},

			_updateInputWidth: function() {
				var   indent = 6 // ширину делаем с небольшим запасом
					, cloneWidth;

				if (!this.$inputClone) {
					// делаем клон инпута, чтобы мерять ширину его текста
					this.$inputClone = $('<span/>')
						.attr({
							'tabindex': -1,
							'class': this.$input.attr('class'),
							'style': this.$input.attr('style')
						})
						.css({
							'overflow': 'hidden',
							'position': 'absolute',
							'marginLeft': -10000,
							'marginTop': -10000,
							'width': 'auto'
						})
						.appendTo(this.$container);
				}

				// вставляем в клон текст из инпута и узнаем ширину текста
				this.$inputClone.text(this.$input.val());
				cloneWidth = this.$inputClone[0].scrollWidth;
				this.$input.width( cloneWidth + indent );
			},

			/*
			 * @returns Либо сам инпут, либо лейбл который он редактирует
			 */
			_getInputWrap: function() {
				return (this.$input.closest('.js-input-wrap').length)
					? this.$input.closest('.js-input-wrap')
					: this.$input;
			},

			//*********** labels **********

			_getLabels: function() {
				return $('.js-compose-label',this.$container);
			},

			//*** создание лейблов ******

			_createLabel: function(str, noSave) {
				ajs.log('_createLabel',str);
				str = str
					/*.replace(/,/g,'')*/
					.replace(/(^\s+|\s+$)/g, '');

				if (str.length) {
					this.opts.noblur = true;
					var $label = this.$input.closest('.js-input-wrap'); // может ничего создавать и не надо

					if ($label.length) {
						// мы редактировали лейбл, так что надо вернуть в него текст и все.
						var oldText = $label.data('text');
						// меняем стили
						$label
							.removeClass()
							.addClass('js-compose-label compose__labels__label');
						// вставляем текст
						$label
							.data('text',str)
							.find('.js-label-text')
							.text(str)
							.show();

						if ($label.data('max-width'))
							$label.css('max-width',$label.data('max-width'));

						if (oldText != str) {
							Counter.d(1708702);
						}
					}
					else {
						// создаем новый лейбл и кладем рядом с инпутом
						$label = this.$container.find('.js-compose-label:first').clone();
						$label
							.data('text',str)
							.css('display','')
							.find('.js-label-text').text(str);

						this.$input.before($label);
					}

					this._removeDuplicate(str, $label[0]/*, true*/); // отключил плавное удаление

					// скрываем емейл для адресов из АК
					var labelText = this._suggestToABName($label, str);
					if (!_hasEmail(str)) {
						// лейбл без емейла, помечаем его как невалидный
						$label.addClass('compose__labels__label_invalid');
						if (!this.invalidLabelCounted) {
							Counter.d(1708699);
							this.invalidLabelCounted = true; // считаем только 1 раз
						}
					}

					var maxLen = this.opts.blockMaxWidth || 350
						, maxChars = Math.round(maxLen * 1.2 / 5); // букв заведомо больше чем максимальная длина блока
					if (labelText.length > maxChars) {
						labelText = labelText.slice(0, maxChars); // лучше отрезать лишние буквы, чтобы не распирало в ие
						$label.find('.js-label-text').text(labelText);
					}

					this._createTooltip($label);

					this.$input.val('').width(1);
					this.$container.append(this.$input);
					if (noSave === undefined)
						this._updateSource();

					this.opts.noblur = false;
				}
			},

			//*** удаление лейблов ******

			_removeLabel: function($label, immediately) {
				ajs.log('_removeLabel',$label,immediately);
				var t = this;

				if (immediately) {
					$label.remove();
					t._updateSource();
				} else {
					var count = $label.length;
					if ($.browser.msie) $label.find('.js-remove-label').hide();
					$label.fadeOut('fast', function() {
						$(this).remove();
						if (--count < 1)
							t._updateSource();
						t._hideTooltip(true);
					});
				}
			},

			_removeAllLabels: function() {
				this._getLabels()
					.not(':first')// кроме первого, он источник для клонирования
					.remove();
			},

			/*
			 * Удаляем лейблы с таким же email,
			 * А если лейблы без емейла, то по полному совпадению текста
			 */
			_removeDuplicate: function(str, label, slow) {
				if (str) {
					this._getLabels()
						.filter(':visible')
						.each(function() {
							if (this != label) {
								var labelText = $(this).data('text') || '';
								if(_suggestToEmail(labelText) == _suggestToEmail(str)) {
									if(slow) {
										$(this).fadeOut('slow', function() {
											$(this).remove();
										});
									} else {
										$(this).remove();
									}
								}
							}
						});
				}
			},

			//*** выделение лейблов ******

			_deselectAllLabels: function() {
				this._getLabels().removeClass('compose__labels__label_selected');
				this.$lastSelectedLabel = null;
			},

			_deselectLabel: function($label) {
				$label.removeClass('compose__labels__label_selected');
			},

			_selectAllLabels: function() {
				this._getLabels()
					.filter(':visible')
					.addClass('compose__labels__label_selected')
					.last()
					.focus();
			},

			/*
			 * @param add - true - добавить к уже выделенным
			 * , false - сбросить выделение и выделить текущий
			 */
			_selectLabel: function($label, add) {
				if (!add) {
					this._deselectAllLabels();
				}

				if (!add && ($label.hasClass('compose__labels__label_invalid') || mailru.ComposeLabelsOneClick)) {
					// для невалидных лейблов сразу переходим в редактирование
					this._prepareInput($label);
				}
				else {
					this.$lastSelectedLabel = $label.addClass('compose__labels__label_selected').focus();
				}
			},

			/*
			 * Может быть 1 лейбл, а может и много
			 */
			_getSelectedLabel: function() {
				return this._getLabels().filter('.compose__labels__label_selected');
			},

			_getPrevLabel: function($label) {
				var $prev = $label.prev('.js-compose-label:visible');

				if (!$prev.length) {
					// try to look futher
					$prev = $label
						.prevUntil('.js-compose-label:visible')
						.last().prev();
				}

				return $prev;
			},

			_getNextLabel: function($label) {
				var $next = $label.next('.js-compose-label:visible');

				if (!$next.length) {
					// try to look futher
					$next = $label
						.nextUntil('.js-compose-label:visible')
						.last().next();
				}
				return $next;
			},

			//****************** tooltips ***************

			/*
			 * Создает на основе саджестов блок, показываемый при наведении на лейблы
			 * Хранится прямо в лейбле
			 */
			_createTooltip: function($label) {
				if ($label.hasClass('compose__labels__label_invalid')) {
					// плохие лейблы не заслужили
					return;
				}

				var text = $label.data('text');

				if (_suggestToEmail(text) == text && text.match(RE_EMAIL)) {
					// Текст содержит только емейл. Нужно взять юзернейм из емейла и подставить его вместо имени
					if (!~text.indexOf('<'))
						text = '<' + text;
					if (!~text.indexOf('>'))
						text = text + '>';
					text = text.match(RE_EMAIL)[1] + ' ' + text;
				}

				$label.data('tooltip', this.opts.template(null,htmlEscape(text)));
			},

			_showTooltip: function($label) {
				if (this.suggest.isExpanded() || !$label.data('tooltip')) {
					// занято
					return;
				}

				var   block = this.suggest.block
					, list = this.suggest.list;

				list.empty();
				list.append($label.data('tooltip'))
					.show();

				this.opts.hasTooltip = true;

				// позиционирование блока
				var   offset = $label.offset()
					, width = (typeof this.opts.width == "string" || this.opts.width > 0) ? this.opts.width : Math.max($label.width(), 100)
					, widthNum = (typeof this.opts.width == "string")? parseInt(width) || parseInt(width.slice(0,-2)) : width
					, margin = this.opts.margin ? this.opts.margin : 7
					, max = this.$container.offset().left + this.$container.width() + this.opts.suggestMaxExcess
					, left = (offset.left + widthNum > max)? Math.max(max - widthNum, this.$container.offset().left) : offset.left;


				block
					.css({
						width: width,
						top: offset.top + $label.height() + margin,
						left: left,
						zIndex: 40000
					})
					.stop(true)
					.css('opacity','1')
					.show();
			},

			_hideTooltip: function(immediately) {
				if (this.opts.hasTooltip) {
					if (immediately) {
						this.opts.hasTooltip = false;
						this.suggest.block
							.stop(true, true)
							.unbind('mouseenter.tooltip')
							.unbind('mouseleave.tooltip')
							.hide();
					}
					else {
						this.suggest.block
							.fadeOut(function() {
								this.opts.hasTooltip = false;
								this.suggest.block
									.unbind('mouseenter.tooltip')
									.unbind('mouseleave.tooltip');
							}.bind(this));
					}
				}
			},

			//**************************** drag n drop ***************
			_initDragNDrop: function() {
				// вещь в себе
				var t = this
					, dropTarget = '.js-compose-labels'
					, draggableElement = '.js-compose-label'
					, namespace = '.drag'
					, namespaceDragStart = '.dragstart'
					, dragArea = $(document.body)
					, dragListener = $(document)
					, currentDraggedItem = null
					;

				function startDrag($item) {
					var $clone = $item.clone()
						, offset = $item.offset();

					$clone.css({
						position: 'absolute'
						, left: (offset.left)+'px'
						, top: (offset.top) + 'px'
						, zIndex: 50000
						, 'pointer-events': 'none'
					});

					dragListener
						.bind('mousemove'+namespace, function(e) {
							e.preventDefault();
							var x = Math.min(e.pageX, $(window).width() - $clone.width());
							var y = Math.min(e.pageY, $(window).height() - $clone.height());
							$clone.css({
								left: (x - $item.mousePosition.left) + 'px',
								top: (y - $item.mousePosition.top) + 'px'
							});
						})
						.bind('mouseup'+namespace, function(e) {
							dragArea
								.css('pointer-events','auto');
							e.preventDefault();
							dragListener
								.unbind('mousemove'+namespace)
								.unbind('mouseup'+namespace)
							;

							endDrag($(document.elementFromPoint(e.pageX, e.pageY)),$item);

						})
					;

					dragArea
						.css('pointer-events','none')
						.append($clone);

					t._hideTooltip(true);

					return $clone;
				}

				function endDrag($target, $item) {
					currentDraggedItem.remove();
					currentDraggedItem = null;
					// check target:
					var container = $target.closest(dropTarget);
					if (!container.length || $.contains(container[0],$item[0])) {
						// вертай все назад!
						// todo анимация обратно
					}
					else {
						t._removeLabel($item);
						container.composeLabels('widget').drop($item);
					}
					setDocumentSelection('');
				}

				function dragWait($item) {
					// wait for some motion
					dragListener
						.bind('mousemove'+namespaceDragStart, function(e) {
							e.preventDefault();
							var mousePosition = getMousePosition(e, $item)
								, delta = 3;
							if (   Math.abs(mousePosition.left - $item.mousePosition.left) > delta
								|| Math.abs(mousePosition.top - $item.mousePosition.top) > delta) {

								dragListener.unbind('mousemove'+namespaceDragStart);
								dragListener.unbind('mouseup'+namespaceDragStart);
								dragListener.unbind('selectstart'+namespaceDragStart);
								currentDraggedItem = startDrag($item);
							}
						})
						.bind('mouseup'+namespaceDragStart, function(e) {
							// cancel
							dragListener.unbind('mousemove'+namespaceDragStart);
							dragListener.unbind('mouseup'+namespaceDragStart);
							dragListener.unbind('selectstart'+namespaceDragStart);
							setDocumentSelection('');
						})
						.bind('selectstart'+namespaceDragStart, function(e) {

							e.preventDefault();
						})
					;

					setDocumentSelection('none');
				}

				function getMousePosition(e, $item) {
					var offset = $item.offset();
					return {left: (e.pageX + ajs.scrollLeft() - offset.left || 0), top: (e.pageY + ajs.scrollTop() - offset.top || 0)};
				}

				function setDocumentSelection(value) {
					// in chrome sometimes selection occur despite we prevent it. so disable it with styles
					$(document.body).css({
						'-webkit-user-select':	value
						,'-moz-user-select':	value
						,'-khtml-user-select':	value
						,'-ms-user-select':		value
					});
				}

				function _canUseInThisBrowser() {
					return !!GET['forceComposeLabelsDnd'] || (!$.browser.msie && !$.browser.opera);
				}

				// some public functions
				this.$container.data(this.namespace,
					Object.extend({}, t.$container.data(this.namespace),
						{
							drop: function($item) {
								// droptarget
								// todo анимация на удаление дублей
								t._createLabel(t._getText($item));
							},

							toggleDragNDrop: function(on) {
								t.opts.dragNDropEnabled = (on == true);
							}
						}));

				// listen to drag init
				this.$container.delegate(draggableElement, 'mousedown', function(e) {
					if (t.opts.dragNDropEnabled && !currentDraggedItem
						&& e.which == 1
						&& _canUseInThisBrowser()) {

						var $item = $(e.target).closest(draggableElement);
						$item.mousePosition = getMousePosition(e, $item);
						dragWait($item);
					}
				});
			}

		})
	;

	jsLoader.loaded('{mailru.ui}mailru.ui.ComposeLabels', 1);

// data/ru/images/js/ru/ui/mailru.ui.ComposeLabels.js end

(function($) {
		var namespace = 'composeLabels' + $.expando;

		$.fn.composeLabels = function(param, opts) {
			if (param === 'widget') {
				return this.data(namespace);
			}
			else {
				return this.each(function() {
					var composeLabels = new mailru.ui.ComposeLabels(this, param, namespace, opts);
				})
			}
		};

	})(jQuery);

	jsLoader.loaded('{jQuery}composeLabels', 1);

// data/ru/images/js/ru/jsCore/jquery/composeLabels.js end

jsClass
		.create('mailru.Layers')
		.statics({

		_init:	{},

	// @private
		_base: function (func, type, initFunc)
		{
			if( !this._bL )
			{
				this._bL	= new LightBox('#MailRuConfirm',
				{
					BODY:		'#ScrollBodyInner',
					position:	'fixed',
					fadeColor:	mailru.isDarkPopup ? '#000' : '#fff',
					fadeOpacity: mailru.isDarkPopup ? 0.4 : 0.6,
					$wrapper: $Scroll.normal ? $(document.body) : $ScrollElement,

					init: function ()
					{
						var _check = function (evt) {
							if( this.isVisible() ) {
								if( this.func( (evt.type == 'submit') || /confirm-ok/.test(evt.target.className), this.$Type.toObject(), this.$Type ) !== false )
									this.hide();
								return	false;
							}
						}.bind(this);

						this.$Box
							.find('form').submit(_check).end()
							.find('.confirm-ok,.confirm-cancel,.js-cancel').click(_check)
						;
					},

					onBeforeShow: function ()
					{
						this.$Type.removeClass('dN').show();
					},

					onShow: function ()
							{
								this.type(this._t);

								this.$Type
									.find('INPUT[type!=hidden], TEXTAREA')
										.filter(':text, :password, :file, TEXTAREA').val('').end()
										.eq(0).focus()
								;
							},

					onHide: function ()
							{
								if( this.$Type ) this.$Type.addClass('dN').hide();
								this.$Box
									.css({ marginLeft: '', marginTop: '', left: '', top: '', zIndex: 30012 })
									.removeClass('is-'+this._t)
								;
								this._t	= '';
							},

					type:	function (t)
							{
								if( this._t != t )
								{
									if( this.$Type ) this.$Type.addClass('dN').hide();

									this.$Box.replaceClass(/is-\w+/, '').addClass('is-'+ t);
									this._t		= t;
									this.$Txt	= $('#is-'+ t +'-txt');
									this.$Type	= this.$Box.find('.is-'+ t +'_in');
									this.$Submit= this.$Type.find(':submit');
								}
							},
					text:	function (t){ this.$Txt.text(t); },
					getType:function (){ return this._t; }
				});

				this._bL.onHide();
				this._bL.type(type);
			}

			var L = this._bL;

			if( type ) L.type(type);
			if( func ) L.func = func;


			var t	= L.getType();
			if( !this._init[t]  )
			{
				this._init[t] = 1;
				(initFunc || jsCore.F).call(L);
			}

			return	L;
		},



	// @public
		// Secure folder
		secure: function (id, fn){
			fn = fn || ajs.F;
			var
				Folder	= mailru.Folders.getSafe(id),
				Layer	= this._base(function (ok, Form, $Node){
					$Node = $(':password', $Node).val('');

					var messageElem = $Node.parent().find('.form__message');
					messageElem.empty();
					$Node.removeClass('form__field_error');
					if( ok ){
						mailru.Ajax({
							  url: '/cgi-bin/folderlogin?ajax=1'
							, type: 'POST'
							, isUser: true
							, data: { folder: Folder.Id, password: Form.pass }
							, complete: function (R){
								if( R.isOK() ){
									Folder.set('Secure', mailru.Folder.SECURE_OPEN);
									mailru.Layers.hide();
									fn(true, Folder);
								}
								else if( R.isInvalidPassword() ){
									$Node.addClass('form__field_error');
									messageElem
										.html(Lang.get('password.wrong'))
										.addClass('form__message_error');
									$Node.first().focus();
								}
							}
						});
						return	false;
					} else {
						fn(false, Folder);
						if( window.documentView )
							documentView.redraw();
					}
				}, 'secure')
			;

			Layer.text( Folder.Name );
			$('A', Layer.$Type).attr('href', '/cgi-bin/folderremind?folder='+ Folder.Id);
			Layer.show();
			return	Layer;
		},


		// Redirect message
		redirect: function (id, func) {
			var L	= this._base(function (ok, d) {
						if( ok ) {
							if(mailru.ComposeLabels && (!this.$Type.find('[name=RedirectTo]').val() || !this.$Type.find('.js-compose-labels').composeLabels("widget").isValid() ) ) {
								var txt = Lang.get('compose.field.invalid_address')
									, a = Lang.get('compose.field.To');
								alert(String.sprintf(txt,a));
								return false;
							}
							this.$Type.find(':input').attr('disabled', true);
							func.call(this, d);
							return	false;
						}
					}, 'redirect', function (n)	{
						this.$Type.find(n = '[name=RedirectTo]').expandField();
						var $inp = this.$Type.find(n);

						if (mailru.ComposeLabels) {
							$inp.composeLabels(null, {blockMaxWidth: 150});
							// redefine inp
							$inp = this.$Type.find(n);
							this.onShow = function() {
								// super.onShow
								this.type(this._t);

								this.$Type
									.find('INPUT[type!=hidden], TEXTAREA')
									.filter(':text, :password, :file, TEXTAREA').val('').end()
									.eq(0).focus()
								;
								// clear compose labels
								if (this._t == 'redirect' && $inp && $inp.length) {
									$inp.val('').trigger('change');
								}
							}
						}
						else if (mailru.CanUseNewAddressbookSuggests) {
							$inp.addressbookSuggest();
						}
						else {
							$.Autocompleter.addressbook($inp, true);
							this.$Type.find('.ac-layer').mouseup(function (){ setTimeout(function (){ $inp.triggerHandler('keyup'); }, 5); });
						}
						if (!mailru.ComposeLabels)
							$inp.bind('keyup change', function (){ this.$Submit.attr('disabled', !/@/.test( $inp.val() )) }.throttle(150, this));

						this.$Type.find('.js-addressbook').click(function(evt) {
							mailru.Utils.openAddressbookPopup('RedirectTo');

							evt.preventDefault();
						});

						// Tab indexes
						$inp.attr('tabindex', 101);
						this.$Submit.attr('tabindex', 102);
						this.$Type.find('INPUT.confirm-cancel').attr('tabindex', 103);
					});

			L.$Type
				.find(':input').attr('disabled', false).end()
				.find('INPUT[name=id]').val(id).end()
				.find('A[rel=history]').attr('href', mailru.getPageURL('compose', { id: id, mode: 'forward' }))
			;

			L.$Submit.attr('disabled', !mailru.ComposeLabels);

			L.show();

			return L;
		},

		// Hide active layer
		hide: function (){ if( this._base().isVisible() ) this._base().hide(); },

		fade: function (s, t)
		{
			if( !this._fL )
			{
				this._fL	= new LightBox($('<div style="color: #fff; font-size: 20px;">' + Lang.get('lightbox.wait') + '</div>').appendTo('BODY'));
			}

			if( t ) this._fL.$Box[0].innerHTML = t;
			this._fL.disabledHide	= s;
			return	this._fL[s ? 'show' : 'hide']();
		},

		get: function (type, func, initFunc)
		{
			return	this._base(func, type, initFunc);
		}

	});


	jsLoader.loaded('{mailru}mailru.Layers', 1);

// data/ru/images/js/ru/mailru.Layers.js end

// data/ru/images/js/ru/Views/mailru.View.ReadMsg.js start

/**
 * @class	mailru.View.ReadMsg
 * @author	RubaXa	<trash@rubaxa.org>
 */



// data/ru/images/js/ru/Views/mailru.View.ReadMsgMisc.js start

/**
 * @class mailru.View.ReadMsgMisc
 */
jsClass
.create('mailru.View.ReadMsgMisc')
.methods({


	upd: function (msg, params)
	{	try {

		var cacheKey	= this.getCacheKey(msg);
		if( this._cacheKey == cacheKey ) return;

		var mID	= msg.getId();
		var fID	= msg.FolderId;
		var mID_fID = 'id='+mID+'&folder='+fID+'&'+now();

		params = $E({ charset: '', adding: '', welcome: '' }, params);

		// Prev/Next
		this.$Nav.css({ display: !mailru.isFilterFolder() && (msg.PrevId || msg.NextId) ? '' : 'none' });

		// Flagged
		this.$Flag.toggleClass('mr_read__flag_y', !!+msg.Flagged);

		// IcoFrom
		//var _if = +!!msg.IcoFromWho, _oa = mailru.isMailRuDomain(msg.From);
		var _if = 0, _oa = mailru.isMailRuDomain(msg.From);

		this.$IcoFrom.display(_if || _oa);

		if( _if )		this.$IcoFrom.css({ backgroundImage: 'url(//img.mail.ru/mail/ru/images/default/ico-from/12'+msg.IcoFromWho+'.png)' });
		else if( _oa )	this.$IcoFrom.css({ backgroundImage: 'url(//status.mail.ru/?'+ (msg.From.replace(/(\.ru)(.+)$/, '$1') && RegExp.$1) +'.png)' });

		// SubIcon
		this.$subjIco.attr('className', !msg.isNormal() ? ('nm_Icons iOnes iMsg' + (msg.isHigh() ? 'H' : 'L')) : '');

		// add address, filters, spam
		var F = mailru.Folders.get(fID);
		if( F )
		{
			this.$msgNoSent.css({ display: F.inFolder(mailru.Folder.SENT) ? 'none' : '' });
			this.$msgIsBulk.css({ display: !F.inFolder(mailru.Folder.BULK) ? 'none' : '' });
		}


		// < Headers
		var _hdr = /mh-([\w_-]+)/i;
		this.$Fields.each($D(this, function (i, N)
		{
			var n = N.className.match(_hdr)[1], v = msg[n];

			if( n == 'To' )	v = (msg.ToList || msg.To || ('<' + Lang.get('readmsg.not_specified') + '>'));
			else if( n == 'From' ){	// @todo Разобраться с FromList/FromFull и оставить что-то одно
				v	= ((msg.FromList || msg.FromFull)+'').match(/^(.+)(&lt;.+)/i);
				v	= (v == null) ? msg.FromList : '<span class="mr_read__fromf">'+v[1]+'</span>'+v[2];
			}
			else if( n == 'DateUTS' )
			{
				v = new Date(msg.DateUTS * 1000).getLocaleDateFull();
			}
			else if( n == 'Subject' )
			{
				if( !v ) v	= msg.getSubject();
				N.title		= Lang.get('Messages').priority[msg.Priority];
			}

			$('.val', N).html( v );
			$FS(N).display	= !!v && v !== '' ? '' : 'none';
		}));
		// Headers >


		var View	= jsView.get('readmsg');


		// Links href
		this.$Url.each($D(this, function (i, N){

			var name = N.className.match(/u(rl)?-([\w-]+)/) ? RegExp.$2 : '', url = '';

			if( !name ) return;

			name	= String.ucfirst( name );

			switch( name )
			{
				case 'Prev':
				case 'Next':
				{	// Navigation
					var id = msg[name+'Id'];
					url = id ? mailru.getPageURL('readmsg', { id: id }) : 'javascript:;';
					$(N)
						.toggleClass(View.clNav, !id)
						.children('.icon')
						.toggleClass('icon_arrow-' + (name === 'Prev' ? 'up' : 'down') + '_disabled', !id);
				}
				break;

				case 'ViewType':
						url	= mailru.getPageURL('readmsg', { id: mID }) + '?mode=header';
					break;

				case 'ShowImages':
						url	= mailru.getPageURL('readmsg', { id: mID }) + '?bulk_show_images=1';
					break;

				case 'Reply': url = mailru.getPageURL('compose', { id: mID, mode: 'reply' }); break;
				case 'ReplyAll': url = mailru.getPageURL('compose', { id: mID, mode: 'replyall' }); break;

				case 'Forward':
				case 'Forward-attach':
						url = mailru.getPageURL('compose', { id: mID, mode: name.toLowerCase() });
					break;

				case 'Composebounce': url = '/cgi-bin/composebounce?'+mID_fID+'&adding='+params.adding; break;
				case 'Print': url = mailru.getPageURL('readmsg', { id: mID }) + '?template=printmsg.tmpl&adding='+(params.mode == 'header' ? 'top' : ''); break;

				case 'Getmsg': url = '/cgi-bin/getmsg?'+mID_fID; break;

				case 'FromIco':
						if( _oa )
						{
							url		= "http://www.mail.ru/agent?message&to="+msg.From;
							N.title	= Lang.get('readmsg.click_to_magent');
						}
						else if( !(_if || _oa) ) return;
						else url = 'javascript:;';
					break;

				case 'Gosearch':	url = mailru.getPageURL('search')+'?q_from='+msg.From; N.title = Lang.get('readmsg.find_from').replace('%s', msg.From);  break;
				case 'Blacklist':	url = '/cgi-bin/movemsg?addfilter&'+mID_fID; break;
				case 'Editfilter':	url = '/cgi-bin/editfilter?msg'+mID_fID; break;
				case '2whitelist':	url = '/cgi-bin/movemsg?whitelist&'+mID_fID; break;
				case 'New_abcontact': url = '/cgi-bin/new_abcontact?msg'+mID_fID; break;

				case 'Remove':
						if( !this._delGET ) this._delGET = String.toObject(N.href);
						var k, v;
						for( k in this._delGET ) if( v = (msg.get(String.ucfirst(k)) || params[k]) ) url += '&'+k+'='+v;
						url = '/cgi-bin/movemsg?remove' + url + (mailru.MsglistAfterDelete && msg.NextId ? '' : '&next='+msg.NextId);
					break;

				case 'Spam':
				case 'Nospam':
					{
						url	= F.isBulk() ?
							'/cgi-bin/movemsg?id=' + msg.Id + '&move=1&nospam=1' + ((mailru.ListUnsubscribeEnabled && msg.ListSubscribe) ? '&subscribe=1' : '')
							: 'spamabuse?id=' + msg.Id + ((msg.ListUnsubscribe && mailru.ListUnsubscribeEnabled) ? '&unsubscribe=1' : '');
						$(N)
							.find('.js-spam-txt')
							.html(F.isBulk() ?
								((mailru.ListUnsubscribeEnabled && msg.ListSubscribe) ? Lang.get('ListSubscribe') : Lang.get('IsNotSpam'))
								: Lang.get('IsSpam')
							);
						if( F.isSent() || F.isDrafts() || ((F.isBulk() && name == 'Spam') || (!F.isBulk() && name != 'Spam')) ) url = '';
					}
					break;

				case 'Translate': url = mailru.getPageURL('readmsg', { id: mID }) + '?mode=translate&direction=re'; break;
			}

			N.href = url && url.indexOf('javascript:;') == -1 ? url : 'javascript:;';
			$FS(N).display = url ? '' : 'none';
		}));

		if( mailru.ListUnsubscribeEnabled && msg.ListUnsubscribe ) Counter.d(1678304);
		if( mailru.ListUnsubscribeEnabled && msg.ListSubscribe ) Counter.d(1611485);

		// < Avatar
		this.updAvatar(msg);
		// Avatar >

		this._cacheKey	= cacheKey;

		} catch (er) { debug.log(er); }
	},

	updAvatar: function (msg) {
		var avatarSrc = mailru.Utils.getAvatarSrcByMessage(msg, 90);
		var avatarUrl = mailru.Utils.getAvatarUrlByMessage(msg);

		var $link = $('.js-avatar-link', this.$Avatar);

		if (avatarSrc) {
			$link.css('backgroundImage', 'url("' + avatarSrc + '")');
			if (avatarUrl) {
				$link.attr({
					href: avatarUrl,
					target: '_blank'
				});
			} else {
				$link.removeAttr('href').removeAttr('target');
			}
		}

		this.$Avatar.display(!!avatarSrc);
		this.$Top.find('.mr_read__top').toggleClass('mr_read__top_ava', !!avatarSrc);
	},

	updIF: function (msg)
	{
		this.$IF.each($D(this, function (i, N)
		{
			var d = 0, name = N.className.match(/if-(Not)?([^\s"]+)/) ? RegExp.$2 : null, not = RegExp.$1 == 'Not';

			switch( name )
			{
				case 'Drafts':	d = msg.inFolder(mailru.Folder.DRAFTS); break;
				case 'IsMe':	d = msg.From == mailru.useremail; break;
				case 'Warning': d = (msg.WithPassKeyMsg || msg.WithFakePresent || msg.WithSMSRequestPresent); break;
				case 'SpamBlack': d = msg.x_ubl_black && msg.inFolder(mailru.Folder.BULK); $('#SpamBlackInfo .js-email').html(msg.From); break;
				case 'SpamProbable': d = ((msg.x_spam || msg.x_mras) && !msg.x_ubl_black && msg.inFolder(mailru.Folder.BULK)); break;
				case 'finden_fio-bottom': d =  (msg.finden_fio && msg.HideFastAnswer); break;
				case 'finden_fio-url': d = 1; N.href = 'http://go.mail.ru/search?q='+msg.finden_fio+'&fr=mlbdy'; N.innerHTML = msg.finden_fio; break;

				case 'Attachfiles_Items':
						var count	= (msg.Attachfiles_Items||0)*1 + (msg.Attachlinks_Items||0)*1;
						if( count )
						{
							N.href = mailru.baseHref + jsHistory.get();
							$('.val',  N).html(String.num(count, Lang.get('files.plural'), ' '))
						}
						d = +count;
					break;

				case 'Priority_High': d = msg[name] || msg.isHigh(); break;

				case 'HasBannedImages':
					d = msg[name] || msg._hasBannedImages;
					if ( d ) {
						// to show this even if 'HasBannedImages' will not arrive with next checknew
						msg._hasBannedImages = 1;
						new Image().src = '//rs.' + mailru.SingleDomainName + '/d1131468.gif?' + Math.random();
					}
					break;

				case 'FromSearch':
						d = !!GET.fromsearch;
						if( d ){
							$('.js-back2search', N).attr('href', mailru.getPageURL('search')+'?'+jsHistory.buildParams(0, ['fromsearch', 'id', 'folder'])).show();
						}
					break;

				default:
				{
					d = (not ? !msg[name] : msg[name]);
					if( d && name == 'ShowSecurityImage' )
					{
						$('IMG', N).remove();
						$(N).prepend('<img src="/cgi-bin/get_save_image?'+now()+'" />');
					}
					not = 0;
				}
				break;
			}

			if( not ) d = !d;

			$FS(N).display	= !!d ? '' : 'none';
		}));
	},


	updInp: function (msg)
	{
		var F = mailru.Folders.get(msg.FolderId, true);
		this.$Forms.each(function (i, Form)
		{
			if( Form.name != 'FastAnswer' || msg.Id != Form.re_msg.value )
			{
				Array.forEach(Form.elements, function (N)
				{
					var value = null;
					if( Form.name == 'FastAnswer' )
					{
						switch( N.name )
						{
							case 'copy': 	value = msg.SaveSent ? 'Yes' : ''; break;
							case 'message':	value = msg.ReplyMessageId; break;
							case 're_msg':	value = msg.Id; break;
							case 'To':		value = msg.ReplyTo; break;
							case 'CC':		value = '';msg.Cc; break;
							case 'Subject':	value = msg.SubjectRe; break;
							case 'Body':
							case 'security_image_word':	value = ''; break;
							default: if( defined(msg[N.name]) ) value = msg[N.name]; break;
						}
					}
					else if( Form.name == 'SpamBottom' )
					{
						var isBulk = F.isBulk();
						switch( N.name )
						{
							case 'id' && !isBulk:	value = msg.Id; break;
							case 'back' && !isBulk:	value = mailru.getPageURL('readmsg', { id: msg.Id }); break;
							case 'spamabuse':
							case 'is_not_spam':
								Form.action = isBulk ? '/cgi-bin/spamwarn?id='+msg.Id+'&folder='+msg.FolderId+(msg.NextId ? '&next='+msg.NextId : '') : 'movemsg';
							break;
						}
					}
					else if( Form.name == 'ReceiptInfo' && N.name == 'id' )
					{
						value = msg.Id;
						Form.action = mailru.getPageURL('readmsg', { id: value }) + '?sendrcpt=1';
					}

					if( value !== null ) N.value = replaceEntity(value || '');
				});
			}
		});
	}

});


jsLoader.loaded('{mailru.view}mailru.View.ReadMsgMisc', 1);

// data/ru/images/js/ru/Views/mailru.View.ReadMsgMisc.js end

// data/ru/images/js/ru/mailru.readMsg.trash.js start


// data/ru/images/js/ru/jsCore/jquery/expandField.js start


(function($) {

		var fields = [];

		$.fn.extend({
			expandField: function(options) {
				return this.each(function() {
					new $.ExpandField(this, options);
				});
			}
		});

		$.ExpandField = function(input, options) {
			// not support input.scrollHeight
			if ($.browser.opera && parseFloat($.browser.version) < 9.6)
				return;

			options = $.extend({}, $.ExpandField.defaults, options);

			var $input = $(input),
				minHeight,
				maxHeight,
				scrollHeight,
				indent,
				height,
				isKeyDownDefaultPrevented,
				$parent,
				clone,
				$clone;

			if ($input.is('input')) {
				$input.replaceWith($input = $('<textarea/>')
					.attr({
						'id': $input.attr('id'),
						'name': $input.attr('name'),
						'tabindex': $input.attr('tabindex'),
						'spellcheck': $input.attr('spellcheck'),
						'class': $input.attr('class'),
						'style': $input.attr('style'),
						'autofocus': $input.attr('autofocus')
					}).val($input.val()));

				input = $input[0];

				if( $input.attr('autofocus') ) {
					input.setAttribute('autofocus', 'true');
				}
			}

			$input.bind('keyup change keypress keydown focus', init);

			function init() {
				$input.bind('clearPreviousValue', fieldChange);

				$input
					.unbind('keyup change keypress keydown focus', init)
					.bind({
						'keyup change focus': fieldChange,
						'keypress': fieldKeyPress,
						'keydown': fieldKeyDown
					});

				$parent = $input.parent();

				$clone = $('<textarea/>')
					.attr({
						'tabindex': -1,
						'class': $input.attr('class'),
						'style': $input.attr('style')
					})
					.css({
						overflow: 'hidden',
						position: 'absolute',
						marginLeft: -10000,
						marginTop: -10000
					})
					.appendTo(options.parent || $parent);

				if (options.fixedWidth) {
					$clone.css('width', $input.width());
				}

				clone = $clone[0];

				minHeight = clone.offsetHeight;
				indent = minHeight - clone.scrollHeight;

				if ($.browser.msie && parseInt($.browser.version) < 8) {
					minHeight = clone.scrollHeight;
					indent = minHeight - clone.clientHeight;
					clone.style.position = 'relative';
				}

				if (options.rows > 0) {
					maxHeight = (options.rows * 16) + (minHeight - $clone.height());
				}

				if (input.value && $input.is(':visible')) $input.change();

				updateFieldHeight();
			}

			function fieldKeyDown(evt) {
				isKeyDownDefaultPrevented = evt.isDefaultPrevented();
			}

			function fieldKeyPress(evt) {
				if (!evt.ctrlKey && evt.keyCode == 13 && !isKeyDownDefaultPrevented && !evt.isDefaultPrevented()) {
					clone.value = input.value + '\n';
					updateFieldHeight();
				}
			}

			function fieldChange() {
				clone.value = input.value;
				updateFieldHeight();
			}

			function updateFieldHeight() {
				clone.style.height = clone.offsetHeight + 'px';
				scrollHeight = clone.scrollHeight + indent;
				if (maxHeight) {
					height = Math.max(minHeight, Math.min(maxHeight, scrollHeight));
					if ($input.hasClass('form__field')) {
						$input.toggleClass('form__field_expandable_expanded', scrollHeight > maxHeight);
					}
				}
				else {
					height = Math.max(minHeight, scrollHeight);
				}
				input.style.height = height + 'px';
//				$parent.toggleClass('j-expandField_scroll', scrollHeight > maxHeight);
			}

			var r = {
				getInput: function() {
					return $input;
				}
			};

			fields.push(r);

			if (input.value && $input.is(':visible')) init();

			return r;
		};

		$.ExpandField.defaults = {
			rows: -1,
			fixedWidth: true
		};

		/**
		$(window).resize(function() {
			setTimeout(function() {
				for (var i=0, l=fields.length; i<l; i++) {
					var $input = fields[i].getInput();
					if ($input.is(':visible'))
						$input.change();
				}
			}, 0);
		});
		/**/

	})(jQuery);

	jsLoader.loaded('{jQuery}expandField', 1);

// data/ru/images/js/ru/jsCore/jquery/expandField.js end

jsChecker.add('{mailru}mailru.readMsg.trash', 2);
	mailru.readMsgTrash = {};

	(function (w)
	{
		w.loadZipIncludes = function(R, scope)
		{
			if( R && R[1] == 'OK' )
			{
				if( R[2] && (R[2][0] != null) )
				{
					// < by RubaXa
					var
						  partId	= R[2][0]
						, files		= R[2][1]
						, fSt		= ['filesShow', 'filesHide']
						, $Box		= $(scope).closest('.'+fSt[0])
					;

					if( files == 'ENCRYPTED' )
					{
						$Box.find('.fileShow').after(Lang.get('readmsg.protected_archive')).remove();
					}
					else
					{
						jQuery( buildArchiveTree(partId, files) ).insertBefore( $('.js-info', $Box) );

						// Toggle
						$Box
							.removeClass(fSt[0]).addClass(fSt[1])
							.find('.i-f,.fileHide,.fileShow').unbind('click').each(function ()
							{
								this.onclick = null;
								var $P = jQuery(this).closest('.'+fSt.join(',.'));
								jQuery(this).click(function ()
								{
									var open = $P.hasClass(fSt[1]);
									$P.removeClass(fSt[+open]).addClass(fSt[+!open]);
									return	false;
								});
							});
					}
					// end >
				}
			}
		};


		w.buildArchiveTree = function(partId, files)
		{
			var str = [''], i = 1, name;

			for( name in files )
			{
				var arSub = files[name], isOpen = false, url;

				if( arSub.constructor === Object )
				{
					isOpen = isOpenFolder(arSub);
					str[i++] = tplParse(getAttachTpl(), {
								  tag:		'b'
								, name:		ajs.Html.escape(name)
								, icon:		'f'
								, sub:		buildArchiveTree(partId, arSub)
								, links:	'<a class="fileShow" href="">' + Lang.get('readmsg.show_folder') + '</a><a class="fileHide" href="">' + Lang.get('readmsg.hide_folder') + '</a>'
								, classes:	isOpen ? 'filesHide' : 'filesShow'
							});
				}
				else
				{
					url	= '/cgi-bin/getattach?mode=attachment-zip&id=' + partId + '&file=' + encodeURIComponent(arSub[2]);

					var linksHtml, tag = 'span', col = 'black';
					if( arSub[1] )		linksHtml = Lang.get('readmsg.protected');
					else if( arSub[3] )	linksHtml = Lang.get('readmsg.part');
					else if( arSub[0] < 32*Math.MB )
					{
						tag = 'a';
						col = '';
						linksHtml = '<a href="'+ url +'">' + Lang.get('readmsg.download') + '</a>';
					}


					str[i++] = tplParse(getAttachTpl(), {
									  tag:		tag
									, href:		url
									, name:		ajs.Html.escape(name)
									, icon:		getFileIcon(name)
									, size:		getFileSize(arSub[0])+' &nbsp;'
									, color:	col
									, links:	linksHtml
									, classes:	'filesHide'
								});
				}
				//debug.log(indent + name);
			}

			if( i > 1 )
			{
				str[0]		= '<div class="attIns"><b class="sortD attUg"></b>';
				str[i++]	= '</div>';
			}

			return	str.join('');

			function isOpenFolder(entry)
			{
				for( var name in entry )
				{
					if( entry[name][0] )
						return	false;
				}
				return	true;
			}

			function getFileIcon(file)
			{
				return	(file.match(/\.(\w+)$/)||[])[1];
			}

			function getFileSize(size)
			{
				if( size < 1024 ) return String.num(size, [Lang.get('Size').bytes, Lang.get('Size').bytesPl], '&nbsp;');
				else if( size < 1024*1024 ) return Math.round(size/1024)+'&nbsp;' + Lang.get('Size').kb;
				else return Math.round(size/1024/1024)+'&nbsp;' + Lang.get('Size').mb;
			}
		}


		function tplParse(tpl, values, parser)
		{
			return	tpl.replace(/\{\{(\w+)\}\}/ig, function (a, name)
			{
				return	values[name]||'';
			});
		}


		function getAttachTpl()
		{
			var T = $F('#tpl-Attach');
			return	T.value || T.innerHTML;
		}
		// END: Archive


		// TranslateForm
		w.open_tr = function(elm)
		{
			var isSel	= elm.tagName.toUpperCase() == 'SELECT';
			var posX	= 50;
			var posY	= 50;
			var form	= $F('#TranslateForm');
			var link	= $F('#TrURL');

			if( form.to_ch )
			{
				if( !isSel && form.to_ch.value == form.from_ch.value )
				{
					alert(Lang.get('trash.error.wrong_translation_direction'));
					return false;
				}

				var direct	= form.from_ch.value + form.to_ch.value;
				link.href	= link.href.replace(/(direction=)[a-z]+/, "$1"+direct);
			}

			if( !isSel )
			{
				SpellWin = w.open(link.href, "Translate",
					"menubar=no,resizable=yes,width=750,height=500,toolbar=no,focus=yes,scrollbars=no," +
					"screenX="+posX+",screenY="+posY+",left="+posX+",top="+posY);
				SpellWin.focus();
			}
		};

		// Answer Link
		w.confirm_answ = function()
		{
			var I = $('FORM[name=FastAnswer] TEXTAREA[name=Body]');
			if( $.trim(I.val()) != "" )
			{
				return	confirm(Lang.get('trash.confirm.go_to_sentmsg'))
			}
			else
				return	true;
		};

		// Remove link
		w.del_confirm = function(link)
		{
			return confirm(Lang.get('trash.confirm.delete_msg'));
		};

		// Show AddressBook
		w.sw = function(addto)
		{
			var posX = (screen.width - 700) / 2;
			var posY = (screen.height - 500) / 2;
			w.open("addressbook?template=quicklist.tmpl&addto="+addto, "sw","width=700,height=500,resizable=yes,scrollbars=yes,top="+posY+",left="+posX);
		};
	})(window);



	/**
	 * AudioPlayer
	 */
	(function (w)
	{
		var
			  volume	= 70
			, curPlayer, play, players
			, _ids		= 0
			, _iPlayers = function ()
			{
				_ids = [];
				$('.js-attachAudio').each(function (){ if( !this.id ) this.id = jsCore.getUniqId(); _ids.push(this.id); });
			}
		;

		var playerUrl = '//img.' + mailru.staticDomainName + '/mail/ru/images/audio_player/player_20111209.swf';
		if (window.IS_LOCAL) {
			playerUrl = 'http://v.demidov.boom.corp.mail.ru/audio_player/player2.swf?r=' + Math.random();
		}

		$E(w, {
			loadPlayer: function (cont, tpl, elm)
			{	_iPlayers(); // init
				var $Elm = jQuery(elm).closest('.js-attachAudio'), pId = $Elm.attr('id'), $X;

				if( audioPlayer.get(pId) )
				{
					if( pId == curPlayer ) audioPlayer.toggle();
					else
					{
						audioPlayer.set(pId);
						audioPlayer.play();
					}
				}
				else if( curPlayer != pId )
				{
					audioPlayer.set(pId);
					if( curPlayer == pId )
					{
						$X = $Elm.closest('.filesShow');

						var file = {
							  time:		''
							, mid:		'0'
							, vol:		volume
							, file:		$X.attr('data-url') || ''
							, title:	$X.attr('data-title') || ''
							, uid:		$X.attr('uid') || ''
							, linkshow:	'1'
							, linkurl:	'http://my.mail.ru/cgi-bin/my/audiotrack%3Ffile='
						};

						$.each(file, function (k, v) {
							file[k] = encodeURIComponent(v);
						});

						players[pId] = SWF.build( $('<div class="audioContainer"/>').insertBefore( $('.js-info', $X) ),
						{
							params: {wmode: 'opaque'},
							movie:	{
										  url:		playerUrl
										, height:	30
									},
							vars:		file
						});
						$X.find('.audioContainerID').hide();
					}
				}
			},

			audioPlayer:
			{
				reset: function ()
				{
					play		=
					curPlayer	= 0;
					players		= {};
				},

				_ico: function (n)
				{
					$('#' + curPlayer).find('.i-spI').removeClass('i-mp3Play i-mp3Pause').addClass('i-mp3' + n);
				},

				set: function (id)
				{
					if( curPlayer ) this.pause();
					play		= 1;
					curPlayer	= id;
					this._ico('Pause');
				},

				get: function (id) {
					var flash = players[id || curPlayer];
					if (flash && !flash.offsetHeight) {
						flash = null;
					}
					return flash;
				},
				play: function ()
				{
					play = 1;
					this._ico('Pause');
					this.get() && this.get().resume();
				},
				pause: function ()
				{
					play = 0;
					this._ico('Play');
					this.get() && this.get().pause();
				},
				toggle: function ()
				{
					this[!play ? 'play' : 'pause']();
				}
			}, // audioPlayer;

			unPause: function (){ debug.log('unPause') },
			setvolume: function (v){ volume = parseInt(v); },
			endMusic: function ()
			{
				audioPlayer._ico('Play');
				var P	= audioPlayer.get(curPlayer);
				if( P )
				{
					P.seek(0);
					P.pause();
				}
				if( _ids.length > 1 )
				{
					var idx	= Array.indexOf(_ids, curPlayer);
					var id	= (_ids[idx+1] || _ids[0]);
					loadPlayer(null, null, '#'+id);
				}
			}

		});


		audioPlayer.reset();
	})(window);

	// Fast answer form
	(function ($)
	{
		var sl = 0, ava, plus = !!document.cookie.match('f_ans=plus'), $SL, $Ava, $I, $B, $Submit, $Form;

		mailru.avaCNT = function (){ if( ava ) (new Image).src = '//rs.' + mailru.SingleDomainName + '/d347460.gif?rnd='+Math.random(); };
		mailru.initFastAnswer = function(reInit)
		{
			if( reInit && ($SL !== undef) )
			{
				sl	= 0;
				$SL.css('display', 'none');
				$('#BBC_tr :input').val('');
				$('#cit_ar,#all_tab TR[id*=_]').css('display', 'none');
				$Submit.attr('disabled', false);
			}
			else
			{
				$SL = $('#show_link');
				$Ava = $('#avaToggle');
				$I = $('#hide_show_all');
				$Form = $('form[name=FastAnswer]');
				$B = $('textarea[name=Body]', $Form);
				$Submit = $Form.find(':submit');

				$('.mlr-snd_input_expand input', $Form).expandField();

				var $auFields = $('.mlr-snd_acitxt[name]', $Form);

				// Show fields
				$B.unbind('click')
					.click(function ()
					{
						if( !sl )
						{
							$Submit.attr('disabled', false);
							if( this.rows != 8 ) this.rows = 8;
							sl = 1;
							$SL.css('display', '');
							$('#To_tr,#cit_ar').css('display', '');
							var pixImg = new Image();
							pixImg.src = "//mail.ru/zero?cln=950A";

							$.Autocompleter.abjs($auFields);
						}
					})
					.bind($.browser.opera ? 'keypress' : 'keydown', function (e) {
						if (e.ctrlKey || e.metaKey) {
							var keyCode = e.keyCode || e.which;
							if (keyCode == jsEvent.Key.enter) {
								e.preventDefault();
								$Form.submit();
							}
						}
					})
				;

				// Show all fields
				$SL.unbind('click').click(function ()
				{
					sl = 2;
					$SL.css('display', 'none');
					$('#all_tab TR').css('display', '');

					var pixImg = new Image();
					pixImg.src = "//mail.ru/zero?cln=950B";

					// Return focus
					$B.focus();

					return	false;
				});

				// +/-
				$('#hide_show_all,#shlop_link').unbind('click').click(function ()
				{
					plus =! plus;
					$I.toggleClass('iShowAns', !plus).toggleClass('iHideAns', plus);
					$('#all_tab,#shlop_com').css('display', plus ? 'none' : '');
					$('#shlop_link').css('display', !plus ? 'none' : '');
					if( sl == 1 ) $SL.css('display', plus ? 'none' : '');
					jsCookie.set('f_ans', plus ? 'plus' : 'minus');
					return	false;
				});

				// Quoting
				$('#cit_ar').click(function ()
				{
					var text	= (window.currentMessage || mailru.Messages.get(mailru.messageId)).let_body_plain;
					$B[0].value	+= "\n\n\n"+String.trim( text );
					$B.focus();
					if( $B[0].setSelectionRange ) $B[0].setSelectionRange(0, 0);
					return	false;
				});

				function captchaCheckSuccess(evt, code)
				{
					$('input[name="security_image_word"]', $Form).val(code || '');
					this.hide();
					$Form.trigger('submit');
				}

				function showCaptcha(verified)
				{
					if (verified)
					{
						$R('{mailru'+'.compose}mailru.Compose.Captcha', $.proxy(function()
						{
							var t = this, captcha = t.captcha;
							if (!captcha)
							{
								captcha = t.captcha = new mailru.Compose.Captcha();
								captcha.bind('checkSuccess', {'scope': t}, captchaCheckSuccess);
							}
							captcha.show();
						}, this));
					}
					else
					{
						$R('{mailru'+'.compose}mailru.Compose.CaptchaCombine', $.proxy(function()
						{
							var t = this, captcha = t.captchaVerified;
							if (!captcha)
							{
								captcha = t.captchaVerified = new mailru.Compose.CaptchaCombine();
								captcha.bind('verifySuccess', {'scope': t}, captchaCheckSuccess);
							}
							captcha.show();
						}, this));
					}
				}

				// Form
				$Form.submit(function ()
				{
					if( !$.trim($B.val()).length )
					{
						alert(Lang.get('trash.error.empty_msg'));
						return	false;
					}
					else if( !/@/i.test( $('TEXTAREA[name=To]', this).val() ) )
					{
						alert(Lang.get('trash.error.empty_to'));
						return	false;
					}
					else if( mailru.Ajax )
					{
						$Submit.attr('disabled', true);
						mailru.Ajax.post('/compose/?ajax_call=1&func_name=send&send=1', $(this).serialize().replace(/(old_charset=)[^&]+/i, '$1utf-8'), function (R)
						{
							$Submit.attr('disabled', false);
							var d = R.getData();
							if (d.ShowSecurityImage)
							{
								showCaptcha(d.AccountVerified);
							}
							else if (d.Error)
							{
								jsView.get('sendmsgok').preload( d.Error );
								jsHistory.set( 'sendmsgok?'+now() );
							}
							else
							{
								$B.val('');
								jsView.get('sendmsgok').preload( d.Ok );
								jsHistory.set( d.redir_url );
							}
						});
						return	false;
					}
				});


				// Toggle avatar
				ava = $Ava.hasClass('iAvaHide');
				$Ava.click(function ()
				{
					ava =! ava;
					$Ava.toggleClass('iAvaHide', ava).toggleClass('iAvaShow', !ava);
					$('#avatar-show').css('display', ava ? '' : 'none');
					$.post('/cgi-bin/ajax_avatarstat?ajax_call=1&func_name=ajax_set_stat_avatar&data=["'+(+!ava)+'"]');
					return	false;
				});


				$auFields.each(function(){ $.Autocompleter.addressbook(this); });
			}
		};

		mailru.readMsgTrash.cfm =
		{
			cfm: function(link)
			{
				var txt = link.href.replace(/http:\/\/([A-Za-z0-9_\-\.]+)[^>]*/ig , "$1");
				return	confirm(Lang.get('trash.confirm.open_site').replace('%s', txt));
			},

			cfmn: function(link, url)
			{
				var txt = link.href.replace(/http:\/\/([A-Za-z0-9_\-\.]+)[^>]*/ig , "$1");
				return	confirm(Lang.get('trash.confirm.open_site').replace('%s', txt));
			},

			cfmf: function(url)
			{
				return confirm(Lang.get('trash.confirm.open_site').replace('%s', url));
			}
		};
		$E(window, mailru.readMsgTrash.cfm);

	})(jQuery);



	jsLoader.loaded('{mailru}mailru.readMsg.trash', 1);

// data/ru/images/js/ru/mailru.readMsg.trash.js end

// data/ru/images/js/ru/jsCore/Projects/mail.ru/AttachViewer/mailru.FullAttachViewer.Viewer.js start


// data/ru/images/js/ru/mailru.BindedCounters.js start


(function($) {

		var COUNTERS = {

			// MAIL-221
			VERIFIED_SHOW: 386681,
			VERIFIED_SUCCESS: 386683,
			VERIFIED_FAIL: 386684,
			UNVERIFIED_SHOW: 386686,
			UNVERIFIED_SIGNUP_PHONE: 386687,
			UNVERIFIED_SEND_REQUEST: 386688,
			UNVERIFIED_CANCEL: 386689,
			UNVERIFIED_SUCCESS: 386690,
			UNVERIFIED_FAIL: 386691,

			// MAIL-1311
			COMPOSE_SHOW: 440880,
			COMPOSE_SEND: 440881,
			COMPOSE_SAVE: 440882,
			COMPOSE_CANCEL: 440883,
			COMPOSE_SHOW_ALL_FIELDS: 440884,
			COMPOSE_REAL_NAME_LINK_CLICK: 440885,
			COMPOSE_REAL_NAME_CHANGE: 440887,
			COMPOSE_REAL_NAME_SETTINGS: 440889,
			COMPOSE_ADDRESSBOOK_LINKS_CLICK: 440890,
			COMPOSE_ADDRESSBOOK_ICONS_CLICK: 440891,
			COMPOSE_UPLOADER_ADD_FILE_FLASH: 440892,
			COMPOSE_UPLOADER_ADD_FILE_JS: 440893,
			COMPOSE_UPLOADER_SETTINGS: 440895,
			COMPOSE_PRIORITY: 440896,
			COMPOSE_RECEIPT: 440897,
			COMPOSE_EDITOR_TOOLBAR_BOTTONS_LT_SMILES: 440898,
			COMPOSE_EDITOR_TOOLBAR_SMILES: 440899,
			COMPOSE_EDITOR_TOOLBAR_UNDOREDO: 440901,
			COMPOSE_EDITOR_TOOLBAR_BOTTONS_FORMAT: 440902,
			COMPOSE_EDITOR_TOOLBAR_ENABLE_TEXT_EDITOR: 440903,
			COMPOSE_EDITOR_TOOLBAR_ENABLE_HTML_EDITOR: 440904,
			COMPOSE_EDITOR_TOOLBAR_TRANSFER: 440905,
			COMPOSE_EDITOR_TOOLBAR_KEYBOARD: 440907,
			COMPOSE_EDITOR_TOOLBAR_SPELL: 440908,
			COMPOSE_EDITOR_TOOLBAR_TRANSLIT: 440909,
			COMPOSE_EDITOR_TOOLBAR_STYLE: 440910,
			COMPOSE_EDITOR_TOOLBAR_STYLE_SELECT: 440911,

			 // MAIL-11956
			COMPOSE_EDITOR_TOOLBAR_SIGNATURE: 1345775,
			COMPOSE_EDITOR_TOOLBAR_SIGNATURE_CLICK: 1345777,
			COMPOSE_EDITOR_TOOLBAR_CARD_SELECT: 1345781,


			FOLDERS_INBOX: 440739,
			FOLDERS_BULK: 440740,
			FOLDERS_SENT: 440741,
			FOLDERS_DRAFTS: 440742,
			FOLDERS_TRASH: 440745,
			FOLDERS_USER: 440746,
			FOLDERS_SETTINGS: 440748,
			FOLDERS_UNREAD: 440749,
			FOLDERS_MRIM_ARCH: 440750,
			FOLDERS_CLEAR_TRASH: 440751,
			FOLDERS_CLEAR_BULK: 440752,

			MSGLIST_PAGE1: 440753,
			MSGLIST_PAGE2: 440755,
			MSGLIST_PAGE3: 440756,
			MSGLIST_PAGE4: 440757,
			MSGLIST_PAGE5: 440758,
			MSGLIST_PAGE_OTHER: 440760,
			MSGLIST_SHORT_MODE: 440762,
			MSGLIST_FULL_MODE: 440763,
			MSGLIST_SELECT_LINK: 440764,
			MSGLIST_SELECT_ALL_LINK: 440765,
			MSGLIST_SELECT_UNREAD_LINK: 440766,
			MSGLIST_SELECT_READ_LINK: 440767,
			MSGLIST_SELECT_MARK_LINK: 440769,
			MSGLIST_SELECT_WITHFILES_LINK: 440771,
			MSGLIST_SELECT_FROMUSER_LINK: 440772,
			MSGLIST_SELECT_NONE_LINK: 440773,
			MSGLIST_DELETE: 440774,
			MSGLIST_SPAM: 440775,
			MSGLIST_MOVE_LINK: 440778,
			MSGLIST_MOVE: 440779,
			MSGLIST_MOVE_CREATE_NEW_FOLDER: 440780,
			MSGLIST_MARK_LINK: 440781,
			MSGLIST_MARK_READ: 440782,
			MSGLIST_MARK_UNREAD: 440783,
			MSGLIST_MARK_FLAG: 440784,
			MSGLIST_MARK_UNFLAG: 440785,
			MSGLIST_MORE_LINK: 440786,
			MSGLIST_MORE_ADDRESSBOOK: 440787,
			MSGLIST_MORE_BLACKLIST: 440788,
			MSGLIST_MORE_CREATE_FILTER: 440790,
			MSGLIST_MORE_SEARCH: 440792,
			MSGLIST_MORE_FORWARD: 440793,
			MSGLIST_SORT_LINK: 440795,
			MSGLIST_SORT: 440796,
			MSGLIST_ATTACH: 440799,

			READMSG_SHOW: 440802,
			READMSG_PREV_MESSAGE: 440809,
			READMSG_NEXT_MESSAGE: 440810,
			READMSG_REPLY: 440811,
			READMSG_REPLY_ALL: 440812,
			READMSG_FORWARD: 440813,
			READMSG_DELETE: 440815,
			READMSG_SPAM: 440816,
			READMSG_MOVE_LINK: 440817,
			READMSG_MOVE: 440818,
			READMSG_MOVE_CREATE_NEW_FOLDER: 440819,
			READMSG_MARK_LINK: 440820,
			READMSG_MARK_READ: 440821,
			READMSG_MARK_UNREAD: 440822,
			READMSG_MARK_FLAG: 440824,
			READMSG_MARK_UNFLAG: 440825,
			READMSG_MORE_LINK: 440826,
			READMSG_MORE_ADDRESSBOOK: 440827,
			READMSG_MORE_BLACK_LIST: 440828,
			READMSG_MORE_CREATE_FILTER: 440829,
			READMSG_MORE_SEARCH: 440831,
			READMSG_MORE_TRANSFER: 440832,
			READMSG_MORE_PRINT: 440833,
			READMSG_MORE_DOWNLOAD: 440834,
			READMSG_MORE_RESEND: 440835,
			READMSG_MORE_FORWARD: 440836,
			READMSG_MORE_RFC: 440837,
			READMSG_PRINT_ICON: 440838,
			READMSG_TRANSLIT_ICON: 440839,
			READMSG_FLAG_ICON: 440841,
			READMSG_ADDRESSBOOK_ICON: 440842,
			READMSG_SEARCH_FROM_USER: 440843,
			READMSG_CHANGE_AVATAR: 440844,
			READMSG_ATTACH_ICON: 440845,
			READMSG_ATTACH_IMAGE_SHOW: 440846,
			READMSG_ATTACH_TXTSHOW: 440847,
			READMSG_ATTACH_LINK: 440848,
			READMSG_ATTACH_ITEM_LINK: 440849,
			READMSG_ATTACH_DOWNLOAD: 440850,
			READMSG_ATTACH_ITEM_IMAGE_PREVIEW: 440852,
			READMSG_ATTACH_ITEM_IN_ALBUM: 440853,
			READMSG_ATTACH_ITEM_PREVIEW: 440854,
			READMSG_FAST_ANSWER_SHORT_REPLY: 440855,
			READMSG_FAST_ANSWER_SHORT_REPLYALL: 440856,
			READMSG_FAST_ANSWER_SHORT_FORWARD: 440857,
			READMSG_FAST_ANSWER_SHORT_TEXTAREA: 440858,
			READMSG_FAST_ANSWER_FULL_REPLY: 440860,
			READMSG_FAST_ANSWER_FULL_REPLYALL: 440862,
			READMSG_FAST_ANSWER_FULL_FORWARD: 440863,
			READMSG_FAST_ANSWER_FULL_FORM_LINK: 440865,
			READMSG_FAST_ANSWER_FULL_FORM: 440867,
			READMSG_FAST_ANSWER_FULL_SEND: 440868,
			READMSG_FAST_ANSWER_FULL_SAVE: 440870,
			READMSG_FAST_ANSWER_FULL_CANCEL: 440872,

			// MAIL-4389
			ATTACH_VIEWER_LIST_CLICK: 590136,
			ATTACH_VIEWER_SLIDER_NEXT_CLICK: 590140,
			ATTACH_VIEWER_SLIDER_PREV_CLICK: 590142,
			ATTACH_VIEWER_PREVIEW_NEXT_CLICK: 590144,
			ATTACH_VIEWER_PREVIEW_PREV_CLICK: 590145,
			ATTACH_VIEWER_SLIDER_LIST_CLICK: 590146,
			ATTACH_VIEWER_PREVIEW_IMAGE_CLICK: 590155,
			ATTACH_VIEWER_PREVIEW_OTHER_CLICK: 590156,
			ATTACH_VIEWER_PREVIEW_CLOSE_CLICK: 590157,
			ATTACH_VIEWER_PREVIEW_DOWNLOAD_CLICK: 590158,
			ATTACH_VIEWER_PREVIEW_IN_ALBUM_CLICK: 590162,
			ATTACH_VIEWER_PREVIEW_NEW_WINDOW_CLICK: 590164,

			// MAIL-4561
			ATTACH_VIEWER_MODE_SHORT_CLICK: 602416,
			ATTACH_VIEWER_MODE_FULL_CLICK: 602418,

			THEMES: {

				// MAIL-2778
				  'default': 518501
				, 't1000': 518503
				, 't1001': 518504
				, 't1002': 518505
				, 't1003': 529521
				, 't1004': 529522
				, 't1005': 529523
				, 't1006': 529524
				, 't1007': 529525
				, 't1009': 529526
				, 't1010': 529527
				, 't1011': 529528
				, 't1012': 529529

				// MAIL-3421
				, 't1008': 542191
				, 't1013': 542192
				, 't1014': 542193
				, 't1015': 542195
				, 't1016': 542196

				// MAIL-3523
				, 't1017': 545468
				, 't1018': 545464
//				, 't1019': 545471
//				, 't1020': 545465
				, 't1021': 545466
				, 't1022': 545462
				, 't1023': 545469

				// MAIL-3842
				, 't1024': 558990

				// MAIL-3882
				, 't1025': 570162

				// MAIL-3987
				, 't1026': 570164

				// MAIL-4175
				, 't1027': 570163

				// MAIL-4449
				, 't1028': 599645

				// MAIL-4547
				, 't1029': 603227

				// MAIL-4582
				, 't1030': 603228

				// MAIL-4595
				, 't1031': 603229

				// MAIL-4546
				, 't1032': 603230

				// MAIL-5358
				, 't1038': 658518

				// MAIL-5128
				, 't1036': 658521

				// MAIL-5127
				, 't1037': 658513

				// MAIL-5938
				, 't1041': 660449

				// MAIL-5130
				, 't1040': 658516

				// MAIL-5982
				, 't1042': 720575

				// MAIL-5532
				, 't1043': 660446

				// MAIL-5909
				, 't1044': 545471

				// MAIL-6469
				, 't1045': 818213

				// MAIL-6470
				, 't1046': 868710

				// MAIL-7360
				, 't1047': 868709

				// MAIL-7336
				, 't1048': 866077

				, 't1049': 972824 // MAIL-8175
				, 't1050': 1020302 // MAIL-8175
				, 't1051': 1031938 // MAIL-8598
				, 't1052': 1031708 // MAIL-8595
				, 't1053': 603231 // MAIL-8593
				, 't1054': 1106787 // MAIL-9203
				, 't1055': 1119205 // MAIL-9432
				, 't1056': 1150108 // MAIL-9869
				, 't1057': 1138594 // MAIL-9655
				, 't1058': 1152229 // MAIL-9979
				, 't1059': 1168842  // MAIL-10103
				, 't1060': 1049171  // MAIL-8703
				, 't1061': 1180031  // MAIL-10271
				, 't1062': 1196375  // MAIL-10502
				, 't1063': 1220788  // MAIL-10839
				, 't1064': 1152231  // MAIL-10853
				, 't1065': 1220790  // MAIL-10838
				, 't1066': 1271947  // MAIL-11131
				, 't1067': 1296950  // MAIL-11232
				, 't1068': 1315466  // MAIL-11233
				, 't1069': 1296227  // MAIL-11361
				, 't1070': 1220787  // MAIL-10835
				, 't1071': 1325858  // MAIL-11464
				, 't1072': 1325869  // MAIL-11692
				, 't1073': 1325861  // MAIL-11712
				, 't1074': 1325863  // MAIL-11713
				, 't1075': 1348691  // MAIL-12002
				, 't1076': 1347100  // MAIL-11982
				, 't1077': 1348692  // MAIL-12007
				, 't1078': 1392414  // MAIL-12315
				, 't1079': 1392418  // MAIL-12513
				, 't1080': 1409909  // MAIL-12773
				, 't1081': 1392416  // MAIL-12514
				, 't1082': 1461732  // MAIL-13161
				, 't1083': 1430420  // MAIL-13013
				, 't1084': 1489721  // MAIL-13086
				, 't1085': 1489722  // MAIL-13613
				, 't1086': 1541523  // MAIL-14511
				, 't1087': 1541609  // MAIL-13881
				, 't1088': 1628557  // MAIL-15615
			},

			// MAIL-3689
			THEMES_ON_PAGE_LOAD: {
				  'default': 585249
				, 't1000': 585250 // Божья коровка
				, 't1001': 585251 // Медитация
				, 't1002': 585645 // Город
				, 't1003': 585646 // Крокусы
				, 't1004': 585651 // Клубника
				, 't1005': 585644 // Огни мегаполиса
				, 't1006': 585650 // Фиолетовый холст
				, 't1007': 585647 // Земляника
				, 't1008': 585656 // Зомби
				, 't1009': 585648 // Яркие письма
				, 't1010': 585664 // Полосатая
				, 't1011': 585659 // Кляксы
				, 't1012': 585667 // Лайт
				, 't1013': 585658 // Кошки
				, 't1024': 585662 // Синие крыши
				, 't1015': 585652 // Трава
				, 't1016': 585655 // Сказочный город
				, 't1017': 585657 // Казино
				, 't1018': 585663 // Волк и овцы
				, 't1019': 585673 // Лето в Простоквашино
				, 't1021': 585670 // Simon's Cat
				, 't1022': 585654 // Пирс
				, 't1023': 585665 // Изумрудный город
				, 't1025': 585649 // Хэллоуин
				, 't1026': 585666 // Blackboard

				// MAIL-5531
				, 't1027': 585661
				, 't1028': 599644
				, 't1029': 603236
				, 't1030': 603237
				, 't1031': 603239
				, 't1033': 585671
				, 't1034': 625677

				, 't1038': 658529 // MAIL-5358 14 февраля

				, 't1036': 656830 // MAIL-5128

				, 't1037': 658523 // MAIL-5127 Котики

				, 't1041': 660487 // MAIL-5938 Весенняя

				, 't1040': 658527 // MAIL-5130 Чаепитие в простоквашино

				, 't1042': 720576  // MAIL-5982 Вышивка

				, 't1043': 660483  // MAIL-5532 Сласти

				, 't1044': 585673  // MAIL-5909 Весна в простоквашино
				, 't1045': 818202  // MAIL-6469 Гонки
				, 't1046': 868711  // MAIL-6470 Перья
				, 't1047': 868708  // MAIL-7360 Ромбики
				, 't1048': 866080  // MAIL-7336 Футбол
				, 't1049': 972825  // MAIL-8175 Длиннокот
				, 't1050': 1020300  // MAIL-8489 Эскимосы
				, 't1051': 1031939  // MAIL-8598 Ам Ням
				, 't1052': 1031709  // MAIL-8595 Граффити
				, 't1053': 603243  // MAIL-8593
				, 't1054': 1106788  // MAIL-9203
				, 't1055': 1119206  // MAIL-9432
				, 't1056': 1150111  // MAIL-9869
				, 't1057': 1138595  // MAIL-9655
				, 't1058': 1152230  // MAIL-9979
				, 't1059': 1168846  // MAIL-10103
				, 't1060': 1049160  // MAIL-8703
				, 't1061': 1180032  // MAIL-10271
				, 't1062': 1196376  // MAIL-10502
				, 't1063': 1220792  // MAIL-10839
				, 't1064': 1152234  // MAIL-10853
				, 't1065': 1220793  // MAIL-10838
				, 't1066': 1271948  // MAIL-11131
				, 't1067': 1296952  // MAIL-11232
				, 't1068': 1315467  // MAIL-11233
				, 't1069': 1296228  // MAIL-11361
				, 't1070': 1220791  // MAIL-10835
				, 't1071': 1325872  // MAIL-11464
				, 't1072': 1325879  // MAIL-11692
				, 't1073': 1325875  // MAIL-11712
				, 't1074': 1325877  // MAIL-11713
				, 't1075': 1348693  // MAIL-12002
				, 't1076': 1347101  // MAIL-11982
				, 't1077': 1348694  // MAIL-12007
				, 't1078': 1392428  // MAIL-12315
				, 't1079': 1392433  // MAIL-12513
				, 't1080': 1409910  // MAIL-12773
				, 't1081': 1392430  // MAIL-12514
				, 't1082': 1461734  // MAIL-13161
				, 't1083': 1430421  // MAIL-13013
				, 't1084': 1489723  // MAIL-13086
				, 't1085': 1489724  // MAIL-13613
				, 't1086': 1541524  // MAIL-14511
				, 't1087': 1541612  // MAIL-13881
				, 't1088': 1628545  // MAIL-15615
			},


			// MAIL-5917
			LANG_ON_PAGE_LOAD: {
				  'ru_RU': 688171
				, 'uk_UA': 688173
				, 'en_US': 688175
				, 'uz_UZ': 827872  // MAIL-6997
				, 'be_BY': 997040  // MAIL-8306
				, 'kk_KZ': 1169273  // MAIL-9147
				, 'es_ES': 1196378  // MAIL-9326
				, 'hy_AM': 1196383  // MAIL-9988
			},

			LANG_ON_CHANGE: {
				  'ru_RU': 688170
				, 'uk_UA': 688172
				, 'en_US': 688174
				, 'uz_UZ': 827871  // MAIL-6997
				, 'be_BY': 997037  // MAIL-8306
				, 'kk_KZ': 1169268  // MAIL-9147
				, 'es_ES': 1196373  // MAIL-9326
				, 'hy_AM': 1196382  // MAIL-9988
			},

			// MAIL-5249
			ATTACH_ARCHIVE: {
				  'rar': 655847
				, 'zip': 655849
				, '7z': 655850
				, 'arj': 655851
				, 'tar': 655852
				, 'jar': 655853
				, 'bz2': 655854
				, 'gz': 655856
				, 'lzh': 655857
				, 'cab': 655858
			}
		};

		$(document).bind({

			'Captcha.checkSuccess': function(evt, data) {
				if (data.ref.options.is_verified) {
					Counter.d(COUNTERS.VERIFIED_SUCCESS);
				} else {
					Counter.d(COUNTERS.UNVERIFIED_SUCCESS);
				}
			},

			'Captcha.checkError': function(evt, data) {
				if (data.ref.options.is_verified) {
					Counter.d(COUNTERS.VERIFIED_FAIL);
				} else {
					Counter.d(COUNTERS.UNVERIFIED_FAIL);
				}
			},

			'Captcha.show': function(evt, data) {
				if (data.ref.options.is_verified) {
					Counter.d(COUNTERS.VERIFIED_SHOW);
				} else {
					Counter.d(COUNTERS.UNVERIFIED_SHOW);
				}
			},

			'Captcha.signupPhoneManager': function() {
				Counter.d(COUNTERS.UNVERIFIED_SIGNUP_PHONE);
			},

			'PhoneManager.verifyPhoneCancel': function() {
				Counter.d(COUNTERS.UNVERIFIED_CANCEL);
			},

			'PhoneManager.signupPhoneSuccess': function() {
				Counter.d(COUNTERS.UNVERIFIED_SEND_REQUEST);
			}
		});

		$(window).bind({

			'showForm.compose': function () {
				if (mailru.isSentMsg) {
					Counter.d(COUNTERS.COMPOSE_SHOW);
				}
			},

			'sendClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_SEND);
				} else if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_FAST_ANSWER_FULL_SEND);
				}
			},

			'saveClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_SAVE);
				} else if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_FAST_ANSWER_FULL_SAVE);
				}
			},

			'cancelClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_CANCEL);
				} else if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_FAST_ANSWER_FULL_CANCEL);
				}
			},

			'showAllFieldsLinkClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_SHOW_ALL_FIELDS);
				}
			},

			'realNameLinkClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_REAL_NAME_LINK_CLICK);
				}
			},

			'realNameChange.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_REAL_NAME_CHANGE);
				}
			},

			'realNameSettingsLinkClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_REAL_NAME_SETTINGS);
				}
			},

			'addressBookLinksClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_ADDRESSBOOK_LINKS_CLICK);
				}
			},

			'addressBookIconsClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_ADDRESSBOOK_ICONS_CLICK);
				}
			},

			'uploaderAddFileFlashClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_UPLOADER_ADD_FILE_FLASH);
					Counter.d(COUNTERS.COMPOSE_UPLOADER_ADD_FILE_FLASH);
				}
			},

			'uploaderAddFileJSClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_UPLOADER_ADD_FILE_JS);
					Counter.d(COUNTERS.COMPOSE_UPLOADER_ADD_FILE_JS);
				}
			},

			'uploaderSettingsLinkClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_UPLOADER_SETTINGS);
				}
			},

			'priorityCheckboxClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_PRIORITY);
				}
			},

			'receiptCheckboxClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_RECEIPT);
				}
			},

			'editorToolbarButtonStyleChangeClick.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_STYLE_SELECT);
				}
			},

			'editorToolbarSignatureClick.compose': function() {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_SIGNATURE_CLICK);
				}
			},

			'editorToolbarButtonCardSelect.compose': function () {
				if (mailru.isSentMsg) {
					Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_CARD_SELECT);
				}
			},

			'editorToolbarButtonDropDownClick.compose': function (evt, id) {
				if (mailru.isSentMsg) {
					if (id == 'forecolor' || id == 'backcolor' || id == 'fontactions' || id == 'justifyselect' || id == 'textindentactions' || id == 'bullistactions') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_BOTTONS_LT_SMILES);
					} else if (id == 'emotions') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_SMILES);
					} else if (id == 'signature') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_SIGNATURE);
					}

					var o = {
						forecolor: 964787,
						backcolor: 964788,
						fontactions: 964795,
						justifyselect: 964796,
						textindentactions: 964802,
						bullistactions: 964803,
						emotions: 964804
					};

					if (o[id]) {
						Counter.sb(o[id]);
					}
				}
			},

			'editorToolbarButtonClick.compose': function (evt, cmd) {
				if (mailru.isSentMsg) {
					if (cmd == 'Undo' || cmd == 'Redo') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_UNDOREDO);
					} else if (cmd == 'Strikethrough' || cmd == 'mceLink' || cmd == 'InsertHorizontalRule' || cmd == 'RemoveFormat') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_BOTTONS_FORMAT);
					} else if (cmd == 'mceAppKeyboard') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_KEYBOARD);
					} else if (cmd == 'mceAppTranslit') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_TRANSLIT);
					} else if (cmd == 'mceAppSpelling') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_SPELL);
					} else if (cmd == 'mceAppTransfer') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_TRANSFER);
					} else if (cmd == 'mceEnableTextEditor') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_ENABLE_TEXT_EDITOR);
					} else if (cmd == 'mceEnableHTMLEditor') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_ENABLE_HTML_EDITOR);
					} else if (cmd == 'mceShowTemplates' || cmd == 'mceHideTemplates') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_STYLE);
					} else if (cmd == 'Bold' || cmd == 'Italic' || cmd == 'Underline') {
						Counter.sb(COUNTERS.COMPOSE_EDITOR_TOOLBAR_BOTTONS_LT_SMILES);
					}

					var o = {
						Bold: 964760,
						Italic: 964781,
						Underline: 964782,
						Undo: 964806,
						Redo: 964807,
						Strikethrough: 964812,
						mceLink: 964816,
						InsertHorizontalRule: 964817,
						RemoveFormat: 964818,
						mceShowCards: 964819,
						mceHideCards: 964819
					};

					if (o[cmd]) {
						Counter.sb(o[cmd]);
					}
				}
			},

			'folderLinkClick.folders': function (evt, id) {
				if (id == 0) {
					Counter.sb(COUNTERS.FOLDERS_INBOX);

					// MAIL-5853
					if (mailru.NewHeaderWithMessages) {
						Counter.sb(684443);
					} else {
						Counter.sb(684440);
					}

				} else if (id == 950) {
					Counter.sb(COUNTERS.FOLDERS_BULK);
				} else if (id == 500000) {
					Counter.sb(COUNTERS.FOLDERS_SENT);
				} else if (id == 500001) {
					Counter.sb(COUNTERS.FOLDERS_DRAFTS);
				} else if (id == 500002) {
					Counter.sb(COUNTERS.FOLDERS_TRASH);
				} else {
					Counter.sb(COUNTERS.FOLDERS_USER);
				}
			},

			'folderSettingsLinkClick.folders': function () {
				Counter.sb(COUNTERS.FOLDERS_SETTINGS);
			},

			'folderUnreadLinkClick.folders': function () {
				Counter.sb(COUNTERS.FOLDERS_UNREAD);
			},

			'folderMRIMArchLinkClick.folders': function () {
				Counter.sb(COUNTERS.FOLDERS_MRIM_ARCH);
			},

			'folderClearLinkClick.folders': function (evt, id) {
				if (id == 950) {
					Counter.sb(COUNTERS.FOLDERS_CLEAR_BULK);
				} else if (id == 500002) {
					Counter.sb(COUNTERS.FOLDERS_CLEAR_TRASH);
				}
			},

			'show.msglist': function (evt, page) {
				if (mailru.isMsgList) {
					if (page == 1) {
						Counter.d(COUNTERS.MSGLIST_PAGE1);
					} else if (page == 2) {
						Counter.d(COUNTERS.MSGLIST_PAGE2);
					} else if (page == 3) {
						Counter.d(COUNTERS.MSGLIST_PAGE3);
					} else if (page == 4) {
						Counter.d(COUNTERS.MSGLIST_PAGE4);
					} else if (page == 5) {
						Counter.d(COUNTERS.MSGLIST_PAGE5);
					} else {
						Counter.d(COUNTERS.MSGLIST_PAGE_OTHER);
					}
				}
			},

			'changeModeClick.msglist': function (evt, mode) {
				if (mailru.isMsgList) {
					if (mode) {
						Counter.sb(COUNTERS.MSGLIST_SHORT_MODE);
					} else {
						Counter.sb(COUNTERS.MSGLIST_FULL_MODE);
					}
				}
			},

			'dropDownClick.msglist': function (evt, name, mode) {
				if (mode) {
					if (mailru.isMsgList) {
						if (name == 'select-messages') {
							Counter.sb(COUNTERS.MSGLIST_SELECT_LINK);
						} else if (name == 'folders') {
							Counter.sb(COUNTERS.MSGLIST_MOVE_LINK);
						} else if (name == 'mark') {
							Counter.sb(COUNTERS.MSGLIST_MARK_LINK);
						} else if (name == 'more') {
							Counter.sb(COUNTERS.MSGLIST_MORE_LINK);
						} else if (name == 'sort-messages') {
							Counter.sb(COUNTERS.MSGLIST_SORT_LINK);
						}
					} else if (mailru.isReadMsg) {
						if (name == 'folders') {
							Counter.sb(COUNTERS.READMSG_MOVE_LINK);
						} else if (name == 'mark') {
							Counter.sb(COUNTERS.READMSG_MARK_LINK);
						} else if (name == 'readmsg-more') {
							Counter.sb(COUNTERS.READMSG_MORE_LINK);
						}
					}
				}
			},

			'dropDownLinkClick.msglist': function (evt, name, data) {
				var type = data && data[2];
				if (mailru.isMsgList) {
					if (name == 'select-messages') {
						if (type == 'all') {
							Counter.sb(COUNTERS.MSGLIST_SELECT_ALL_LINK);
						} else if (type == 'unread') {
							Counter.sb(COUNTERS.MSGLIST_SELECT_UNREAD_LINK);
						} else if (type == 'readed') {
							Counter.sb(COUNTERS.MSGLIST_SELECT_READ_LINK);
						} else if (type == 'flagged') {
							Counter.sb(COUNTERS.MSGLIST_SELECT_MARK_LINK);
						} else if (type == 'attach') {
							Counter.sb(COUNTERS.MSGLIST_SELECT_WITHFILES_LINK);
						} else if (type == 'email') {
							Counter.sb(COUNTERS.MSGLIST_SELECT_FROMUSER_LINK);
						} else if (type == 'none') {
							Counter.sb(COUNTERS.MSGLIST_SELECT_NONE_LINK);
						}
					} else if (name == 'folders') {
						if (type == 'new') {
							Counter.sb(COUNTERS.MSGLIST_MOVE_CREATE_NEW_FOLDER);
						} else {
							Counter.sb(COUNTERS.MSGLIST_MOVE);
						}
					} else if (name == 'mark') {
						if (type == 2) {
							Counter.sb(COUNTERS.MSGLIST_MARK_READ);
						} else if (type == 1) {
							Counter.sb(COUNTERS.MSGLIST_MARK_UNREAD);
						} else if (type == 6) {
							Counter.sb(COUNTERS.MSGLIST_MARK_FLAG);
						} else if (type == 7) {
							Counter.sb(COUNTERS.MSGLIST_MARK_UNFLAG);
						}
					} else if (name == 'more') {
						if (type == 'abook') {
							Counter.sb(COUNTERS.MSGLIST_MORE_ADDRESSBOOK);
						} else if (type == 'blist') {
							Counter.sb(COUNTERS.MSGLIST_MORE_BLACKLIST);
						} else if (type == 'create_filter') {
							Counter.sb(COUNTERS.MSGLIST_MORE_CREATE_FILTER);
						} else if (type == 'all') {
							Counter.sb(COUNTERS.MSGLIST_MORE_SEARCH);
						} else if (type == 'as_attachments') {
							Counter.sb(COUNTERS.MSGLIST_MORE_FORWARD);
						}
					} else if (name == 'sort-messages') {
						Counter.sb(COUNTERS.MSGLIST_SORT);
					}
				} else if (mailru.isReadMsg) {
					if (name == 'folders') {
						if (type == 'new') {
							Counter.sb(COUNTERS.READMSG_MOVE_CREATE_NEW_FOLDER);
						} else {
							Counter.sb(COUNTERS.READMSG_MOVE);
						}
					} else if (name == 'mark') {
						if (type == 2) {
							Counter.sb(COUNTERS.READMSG_MARK_READ);
						} else if (type == 1) {
							Counter.sb(COUNTERS.READMSG_MARK_UNREAD);
						} else if (type == 6) {
							Counter.sb(COUNTERS.READMSG_MARK_FLAG);
						} else if (type == 7) {
							Counter.sb(COUNTERS.READMSG_MARK_UNFLAG);
						}
					} else if (name == 'more') {
						if (type == 'abook') {
							Counter.sb(COUNTERS.READMSG_MORE_ADDRESSBOOK);
						} else if (type == 'blist') {
							Counter.sb(COUNTERS.READMSG_MORE_BLACK_LIST);
						} else if (type == 'create_filter') {
							Counter.sb(COUNTERS.READMSG_MORE_CREATE_FILTER);
						} else if (type == 'search') {
							Counter.sb(COUNTERS.READMSG_MORE_SEARCH);
						} else if (type == 'translate') {
							Counter.sb(COUNTERS.READMSG_MORE_TRANSFER);
						} else if (type == 'print') {
							Counter.sb(COUNTERS.READMSG_MORE_PRINT);
						} else if (type == 'getmsg') {
							Counter.sb(COUNTERS.READMSG_MORE_DOWNLOAD);
						} else if (type == 'composebounce') {
							Counter.sb(COUNTERS.READMSG_MORE_RESEND);
						} else if (type == 'forward') {
							Counter.sb(COUNTERS.READMSG_MORE_FORWARD);
						} else if (type == 'ViewType') {
							Counter.sb(COUNTERS.READMSG_MORE_RFC);
						}
					}
				}
			},

			'controlClick.msglist': function (evt, type) {
				if (mailru.isMsgList) {
					if (type == 'delete') {
						Counter.sb(COUNTERS.MSGLIST_DELETE);
					} else if (type == 'spam') {
						Counter.sb(COUNTERS.MSGLIST_SPAM);
					}
				}
			},

			'attachLinkClick.msglist': function () {
				if (mailru.isMsgList) {
					Counter.sb(COUNTERS.MSGLIST_ATTACH);
				}
			},

			'show.readmsg': function () {
				if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_SHOW);
				}
			},

			'actionLinkClick.readmsg': function (evt, type) {
				if (mailru.isReadMsg) {
					if (type == 'reply') {
						Counter.sb(COUNTERS.READMSG_REPLY);
					} else if (type == 'replyAll') {
						Counter.sb(COUNTERS.READMSG_REPLY_ALL);
					} else if (type == 'forward') {
						Counter.sb(COUNTERS.READMSG_FORWARD);
					} else if (type == 'remove') {
						Counter.sb(COUNTERS.READMSG_DELETE);
					} else if (type == 'spam') {
						Counter.sb(COUNTERS.READMSG_SPAM);
					} else if (type == 'print') {
						Counter.sb(COUNTERS.READMSG_PRINT_ICON);
					} else if (type == 'translate') {
						Counter.sb(COUNTERS.READMSG_TRANSLIT_ICON);
					} else if (type == 'prev') {
						Counter.sb(COUNTERS.READMSG_PREV_MESSAGE);
					} else if (type == 'next') {
						Counter.sb(COUNTERS.READMSG_NEXT_MESSAGE);
					} else if (type == 'flag') {
						Counter.sb(COUNTERS.READMSG_FLAG_ICON);
					} else if (type == 'new_abcontact') {
						Counter.sb(COUNTERS.READMSG_ADDRESSBOOK_ICON);
					} else if (type == 'gosearch') {
						Counter.sb(COUNTERS.READMSG_SEARCH_FROM_USER);
					} else if (type == 'go2attach') {
						Counter.sb(COUNTERS.READMSG_ATTACH_ICON);
					} else if (type == 'avatar') {
						Counter.sb(COUNTERS.READMSG_CHANGE_AVATAR);
					}
				}
			},

			'fastAnswerControlsClick.readmsg': function (evt, expanded, type) {
				if (mailru.isReadMsg) {
					if (expanded) {
						if (type == 'reply') {
							Counter.sb(COUNTERS.READMSG_FAST_ANSWER_FULL_REPLY);
						} else if (type == 'replyall') {
							Counter.sb(COUNTERS.READMSG_FAST_ANSWER_FULL_REPLYALL);
						} else if (type == 'forward') {
							Counter.sb(COUNTERS.READMSG_FAST_ANSWER_FULL_FORWARD);
						}
					} else {
						if (type == 'reply') {
							Counter.sb(COUNTERS.READMSG_FAST_ANSWER_SHORT_REPLY);
						} else if (type == 'replyall') {
							Counter.sb(COUNTERS.READMSG_FAST_ANSWER_SHORT_REPLYALL);
						} else if (type == 'forward') {
							Counter.sb(COUNTERS.READMSG_FAST_ANSWER_SHORT_FORWARD);
						}
					}
				}
			},

			'fastAnswerFakeBodyClick.readmsg': function () {
				if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_FAST_ANSWER_SHORT_TEXTAREA);
					Counter.d(COUNTERS.READMSG_FAST_ANSWER_FULL_FORM);
				}
			},

			'fastAnswerFullFormLinkClick.readmsg': function () {
				if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_FAST_ANSWER_FULL_FORM_LINK);
				}
			},

			'attachHasImage.readmsg': function () {
				if (mailru.isReadMsg) {
					Counter.d(COUNTERS.READMSG_ATTACH_TXTSHOW);
				}
			},

			'attachPreviewText.readmsg': function () {
				if (mailru.isReadMsg) {
					Counter.d(COUNTERS.READMSG_ATTACH_IMAGE_SHOW);
				}
			},

			'attachIconClick.readmsg': function () {
				if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_ATTACH_LINK);
				}
			},

			'attachTitleClick.readmsg': function () {
				if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_ATTACH_ITEM_LINK);
				}
			},

			'attachPreviewClick.readmsg': function () {
				if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_ATTACH_ITEM_IMAGE_PREVIEW);
				}
			},

			'attachDownloadLinkClick.readmsg': function () {
				if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_ATTACH_DOWNLOAD);
				}
			},

			'attachInAlbumLinkClick.readmsg': function () {
				if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_ATTACH_ITEM_IN_ALBUM);
				}
			},

			'attachPreviewLinkClick.readmsg': function () {
				if (mailru.isReadMsg) {
					Counter.sb(COUNTERS.READMSG_ATTACH_ITEM_PREVIEW);
				}
			},

			'changeTheme.theme': function (evt, themeId) {
				if (COUNTERS.THEMES[themeId]) {
					Counter.sb(COUNTERS.THEMES[themeId]);
				}
			},

			'cancelLayerTheme.theme': function (evt, themeId) {
				if (COUNTERS.THEMES[themeId]) {
					Counter.sb(COUNTERS.THEMES[themeId]);
				}
			},

			'beforeunloadTheme.theme': function (evt, themeId) {
				if (COUNTERS.THEMES[themeId]) {
					Counter.d(COUNTERS.THEMES[themeId]);
				}
			},

			'attachViewerListClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_LIST_CLICK);
			},

			'attachViewerSliderNextClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_SLIDER_NEXT_CLICK);
			},

			'attachViewerSliderPrevClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_SLIDER_PREV_CLICK);
			},

			'attachViewerPreviewPrevClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_PREVIEW_NEXT_CLICK);
			},

			'attachViewerPreviewNextClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_PREVIEW_PREV_CLICK);
			},

			'attachViewerSliderListClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_SLIDER_LIST_CLICK);
			},

			'attachViewerPreviewImageClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_PREVIEW_IMAGE_CLICK);
			},

			'attachViewerPreviewOtherClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_PREVIEW_OTHER_CLICK);
			},

			'attachViewerPreviewCloseClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_PREVIEW_CLOSE_CLICK);
			},

			'attachViewerPreviewDownloadClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_PREVIEW_DOWNLOAD_CLICK);
			},

			'attachViewerPreviewInAlbumClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_PREVIEW_IN_ALBUM_CLICK);
			},

			'attachViewerPreviewNewWindowClick.attachViewer': function () {
				Counter.sb(COUNTERS.ATTACH_VIEWER_PREVIEW_NEW_WINDOW_CLICK);
			},

			'attachViewerChangeModeClick.attachViewer': function (evt, isShort) {
				if (isShort) {
					Counter.d(COUNTERS.ATTACH_VIEWER_MODE_SHORT_CLICK);
				} else {
					Counter.d(COUNTERS.ATTACH_VIEWER_MODE_FULL_CLICK);
				}
			},

			'attachViewerRedraw.attachViewer': function (evt, files, links) {
				var exts = {}, ext, counters = COUNTERS.ATTACH_ARCHIVE;
				$.each(files.concat(links), function (k, v) {
					ext = v.ext.toLowerCase();
					if (!exts[ext] && counters[ext]) {
						Counter.d(counters[ext]);
						exts[ext] = 1;
					}
				});
			},

			'themePageLoad.themes': function (evt, theme) {
				if (COUNTERS.THEMES_ON_PAGE_LOAD[theme]) {
					Counter.d(COUNTERS.THEMES_ON_PAGE_LOAD[theme]);
				}
			},

			'langPageLoad.lang': function (evt, lang) {
				lang = lang || 'ru_RU';
				if (COUNTERS.LANG_ON_PAGE_LOAD[lang]) {
					Counter.d(COUNTERS.LANG_ON_PAGE_LOAD[lang]);
				}
			},

			'langChange.lang': function (evt, newLang) {
				if (COUNTERS.LANG_ON_CHANGE[newLang]) {
					Counter.d(COUNTERS.LANG_ON_CHANGE[newLang]);
				}
			}
		});

	})(jQuery);

	jsLoader.loaded('{mailru}mailru.BindedCounters', 1);

// data/ru/images/js/ru/mailru.BindedCounters.js end

// data/ru/images/js/ru/jsCore/Projects/mail.ru/AttachViewer/mailru.FullAttachViewer.Utils.js start


/**
	 * @class mailru.FullAttachViewer.Utils
	 */
	jsClass
	.create('mailru.FullAttachViewer.Utils')
	.statics({
		createFilesTree: function(viewerData, response) {
			var utils = this;
			var PartID = response[2][0];

			var tree = {
				leafs: {},

				root: function() {
					return this.get('root');
				},

				get: function(id) {
					return this.leafs[id];
				},

				push: function(file) {
					this.leafs[file.id] = file;
					file.tree = this;

					if(file.parent && this.leafs[file.parent]) {
						this.leafs[file.parent].children.push(file.id)
					}
				},

				getDescendantsOrSelf: function(id) {
					var result = [];
					var self = this.get(id);

					if(self) {
						result.push(self);

						if(self.children) {
							Array.forEach(self.children, function(child) {
								result = result.concat(this.getDescendantsOrSelf(child));

							}.bind(this))
						}
					}

					return result;
				}
			};

			function createNode(data) {
				var folder = {
					id: null,
					parent: null,
					children: [],
					tree: tree,
					isOpen: false,
					list: function() {
						var result = [];

						Array.forEach(this.children, function(id) {
							result.push(this.tree.get(id))

						}.bind(this))

						result.sort(function(a,b) {
							return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0));
						})

						return result;
					},

					toggleOpen: function() {
						this.isOpen = ! this.isOpen;
					},

					isVisible: function() {
						return this.parent == 'root' || (this.tree.get(this.parent).isVisible() && this.tree.get(this.parent).isOpen);
					}
				}

				return $.extend(folder, data);
			};

			function convertAttzipResponse(response, parent) {
				for(var name in response) {
					var file = {};

					file.id = name;
					file.parent = parent;

					if(parent) {
						file.id = parent + '/' + file.id;
					}

					// plain file
					if(response[name] instanceof Array) {
						file = $.extend(file, utils.createFileDescription(viewerData, {
							name: name,
							size: response[name][0],
							encrypted: response[name][1],
							path: response[name][2],
							PartID: PartID

						}, tree.length));

						file = createNode(file);

						tree.push(file);

					// folder
					} else {
						file = $.extend(file, {
							name: name.substring(0, name.length - 1),
							type: 'folder',
							ext: 'f',
							isFolder: 1
						});

						file = createNode(file);

						tree.push(file);

						convertAttzipResponse(response[name], file.id)
					}
				}
			};

			var root = createNode({id: 'root', parent: null});
			tree.push(root)

			convertAttzipResponse(response[2][1], root.id);

			return tree;
		},

		createLinkDescription: function(viewerData, fileData, index) {
			var file = $.extend({
				ContentType:  '',
				avstatus:     '',
				name:         '',
				size:          0,
				downloadlink: '',
				duedate:      '',
				ext:          ''
			}, fileData);

			if (typeof file.name == 'string') {
				file.ext = file.name.replace(/(.*)\./, '').toLowerCase();
			}

			file.iconType = this.getFileIconType(file);

			return file;
		},

		preloadImages: function(src) {
			if (typeof src === 'string')
				src = src.split(',');

			else if (!$.isArray(src))
				return -1;

			//generate random id
			var namespace = '#preloadIMG' + $.expando;

			//create parent element for images
			if (!$(namespace)[0])
				$('<div />', {id: namespace.slice(1)}).hide().appendTo('body');

			//append images
			$.each(src, function () {
				$('<img />', {src: this}).appendTo(namespace);
			});
		},

		createFileDescription: function(viewerData, fileData, index) {

			// MAIL-9487
			if (fileData.ContentName) {
				try {
					fileData.ContentName = decodeURIComponent(fileData.ContentName);
					fileData.ContentEncoding = decodeURIComponent(fileData.ContentEncoding); // MAIL-11899
				} catch (e) {}
			}

			var file = $.extend({
				Subject:        '',
				name:           '',
				size:            0,
				PartID:         '',
				Channel:        '',
				tnef_id:        '',
				ContentText:    '',
				ContentType:    '',
				isRFC822:        0,
				DontShow:        0,
				ForceAddNotype:  0,
				ShowThumbnail:   0,
				AddPhoto:        0,
				IsImage:         0,
				isTNEF:          0,
				IsRtf:           0,
				IsMp3:           0,
				ext:            '',
				BodyStart:      '',
				OriginalBodyLen:'',
				ContentName:    '',
				ContentEncoding:'',
				encrypted:       0,
				isFolder:        0
			}, fileData);

			if (file.isRFC822) {
				if (file.Subject) {
					file.name = file.Subject;
				} else {
					file.name = Lang.get('message.email.untitled');
				}
				file.ext = 'eml';
			} else {
				if (file.FileName) {
					file.name = file.FileName;
				}
				if (typeof file.name == 'string') {
					file.ext = file.name.replace(/(.*)\./, '').toLowerCase();
				}
			}

			file.iconType           = this.getFileIconType(file);
			file.attachPreviewUrl   = this.getAttachPreviewUrl(viewerData, file, index);
			file.downloadUrl        = this.getFileDownloadUrl(viewerData, file, true);
			file.downloadFromZipUrl = this.getFileDownloadFromZipUrl(viewerData, file);
			file.previewWithCropUrl = this.getImagePreviewUrl(viewerData, file, 0, 160, 120);
			file.previewUrl         = this.getImagePreviewUrl(viewerData, file, 90);
			file.previewMSVUrl      = this.getMSVUrl(viewerData, file);
			file.defaultPreviewUrl  = this.getImagePreviewUrl(viewerData, file);
			file.messageReadUrl     = this.getMessageReadUrl(viewerData, file);
			file.imageUrl           = this.getImageUrl(viewerData, file);
			file.addPhotoUrl        = this.getFileAddPhotoUrl(viewerData, file);
			file.notypeInFrameUrl   = this.getFileDownloadUrl(viewerData, file, false, true);
			file.mp3Url             = this.getMp3Url(viewerData, file);
			file.type               = this.getFileType(file);
			file.humanSize          = this.getFileHumanSize(file);

			if (this.isGraphicPreview(file)) {
				file.ShowThumbnail = 1;
			}

			return file;
		},

		getFileHumanSize: function(file) {
			function round(value, precision) {
				return value.toFixed(precision).toString().replace(/0+$/, '').replace(/\.$/, '');
			}

			       if (file.size <                1024 ) { return { size:       file.size                       , unit:  'B' }
			} else if (file.size <             1048576 ) { return { size: round(file.size /             1024, 0), unit: 'kB' }
			} else if (file.size <          1073741824 ) { return { size: round(file.size /          1048576, 2), unit: 'MB' }
			} else if (file.size <       1099511627776 ) { return { size: round(file.size /       1073741824, 2), unit: 'GB' }
			} else if (file.size <    1125899906842620 ) { return { size: round(file.size /    1099511627776, 2), unit: 'TB' }
			} else if (file.size < 1,14841790497948E17 ) { return { size: round(file.size / 1125899906842620, 2), unit: 'PB' }
			}
		},

		getAttachPreviewUrl: function (data, file, index) {
			return '/attaches-viewer/?' + ajs.toQuery({
				id: data.Id,
				_av: file.PartID,
				'x-email': mailru.useremail
			});
		},

		getFileDownloadFromZipUrl: function(data, file) {
			return '/cgi-bin/getattach?mode=attachment-zip&id=' + file.PartID + '&file=' + encodeURIComponent(file.path);
		},

		getFileDownloadUrl: function (data, file, notype, frame) {
			var result = '';
			var params = {
				id: file.PartID,
				bs: file.BodyStart,
				bl: file.OriginalBodyLen,
				ct: file.ContentType,
				cn: file.ContentName,
				cte: file.ContentEncoding
			};
			if (notype) {
				$.extend(params, {
					notype: 1
				});
			}
			if (frame) {
				$.extend(params, {
					frame: 1
				});
			}
			if (file.isTNEF && !file.IsRtf) {
				result = '/cgi-bin/get_tnef_part?' + ajs.toQuery($.extend(params, {
					tnef_id: file.tnef_id,
					mode: 'tnef_attach'
				}));
			} else {

				var baseUrl = '/cgi-bin/getattach?';

				if (!frame) {
					baseUrl = location.protocol + '//' + data.MainMailHost + baseUrl;
				}

				result = baseUrl + ajs.toQuery($.extend(params, {
					file: file.name,
					mode: 'attachment',
					channel: file.Channel
				}));
			}
			return result;
		},

		getFileAddPhotoUrl: function (data, file) {
			var result = '';
			if (file.AddPhoto) {
				result = '//foto.mail.ru/cgi-bin/photo/addphoto?' + ajs.toQuery({
					frommail: file.PartID,
					mode: '0'
				});
			}
			return result;
		},

		getMessageReadUrl: function (data, file) {
			var result = '';
			if (file.isRFC822 && !file.DontShow) {
				result = mailru.getPageURL('readmsg', { id: file.PartID });

				if (file.ForceAddNotype) {
					result += '?notype=1';
				}
			}
			return result;
		},

		isGraphicPreview: function (file) {
			return (mailru['MRVMSGraphicPreview'] && (file.ext == "psd" || file.ext == "tga" || file.ext == "ai" || file.ext == "tif" || file.ext == "tiff" || file.ext == "eps"));
		},

		isOfficePreview: function(file) {
			return ((mailru['MRVMSDocPreview'] || mailru['MRVMSPptPreview'] || mailru['MRVMSExcelPreview']) && (file.ext == 'doc' || file.ext == 'docx' || file.ext == 'xls' || file.ext == 'xlsx' || file.ext == 'ppt' || file.ext == 'pptx'));
		},

		isCSVPreview: function (file) {
			return (mailru['MRVMSCSVPreview'] && file.ext == "csv");
		},

		getImageUrl: function (data, file) {
			var result = '';
			var params = {
				id: file.PartID
			};
			if (file.isTNEF && !file.IsRtf) {
				result = '/cgi-bin/get_tnef_part?' + ajs.toQuery($.extend({}, params, {
					tnef_id: file.tnef_id,
					mode: 'tnef_attach'
				}));
			} else if (this.isGraphicPreview(file)) {
				result = '//docs.' + (mailru.SingleDomainName || 'mail.ru') + '/preview/?' + ajs.toQuery({
					src: file.downloadUrl
				});
			} else if (file.ShowThumbnail && (file.IsImage || file.AddPhoto)) {

				result = '//' + data.MainMailHost + '/cgi-bin/getattach?' + ajs.toQuery($.extend({}, params, {
					file: file.name,
					mode: 'attachment',
					channel: file.Channel
				}));

				if (mailru.exif){

					$.extend(params, {
						exif: 1,
						bs: file.BodyStart,
						bl: file.OriginalBodyLen,
						ct: file.ContentType,
						cn: file.ContentName,
						cte: file.ContentEncoding
					});

					result = (/win27.dev/.test(location.host) ? '//ima64.dev' : '//apf') + '.' + mailru.SingleDomainName + '/cgi-bin/readmsg/' + encodeURIComponent(file.name) +'?' + ajs.toQuery(params);
				}
			}

			return result;
		},

		getMp3Url: function (data, file) {
			var result = '';
			if (file.IsMp3) {
				var params = {
					id: file.PartID,
					mode: 'attachment',
					channel: file.Channel
				};
				if (file.ForceAddNotype) {
					params.notype = 1;
				}
				result = '//' + data.MailAttachZipHost + '/cgi-bin/readmsg/' + encodeURIComponent(file.name) + '?' + ajs.toQuery(params);
			}
			return result;
		},

		getImagePreviewUrl: function (data, file, ps, fx, fy) {
			var url = '';
			if (this.isGraphicPreview(file) || this.isOfficePreview(file)) {
				if (fx == 160 && fy == 120) {
					url = '//docs.' + (mailru.SingleDomainName || 'mail.ru') + '/preview/160x120/?' + ajs.toQuery({
						src: file.downloadUrl
					});
				} else if (arguments.length == 3 && ps == 90) {
					url = '//docs.' + (mailru.SingleDomainName || 'mail.ru') + '/preview/90x90/?' + ajs.toQuery({
						src: file.downloadUrl
					});
				} else if (arguments.length == 2) {
					url = '//docs.' + (mailru.SingleDomainName || 'mail.ru') + '/preview/206x206/?' + ajs.toQuery({
						src: file.downloadUrl
					});
				}
			} else if (file.AddPhoto || (file.IsImage && !file.isTNEF)) {
				var params = {
					id: file.PartID,
					mode: 'attachment',
					channel: file.Channel,
					bs: file.BodyStart,
					bl: file.OriginalBodyLen,
					ct: file.ContentType,
					cn: file.ContentName,
					cte: file.ContentEncoding
				};
				if (file.ShowThumbnail) {
					params.preview = 1;
					if( mailru.exif ) params.exif = 1;
				}
				if (ps) {
					params.ps = ps;
				}
				if (fx) {
					params.fx = fx;
				}
				if (fy) {
					params.fy = fy;
				}
				url = '//';
				if (fx || fy) {
					url += 'apf.' + mailru.SingleDomainName;
				} else {
					url += data.MailAttachPreviewHost;
				}
				url += '/cgi-bin/readmsg/' + encodeURIComponent(file.name) + '?' + ajs.toQuery(params);
			}
			return url;
		},

		getAllFilesDownloadUrl: function (data) {
			var url = '';
			if (data.AttachAllfiles_name && data.AttachAllfiles_AttachHost && data.AttachAllfiles_MsgId && data.AttachAllfiles_PartsId) {
				var params = {
					id: data.AttachAllfiles_MsgId,
					partids: data.AttachAllfiles_PartsId,
					mode: 'attachment',
					fname: data.AttachAllfiles_name
				};
				url = '//' + data.AttachAllfiles_AttachHost + '/cgi-bin/getattachment?' + ajs.toQuery(params);
			}
			return url;
		},

		getMSVUrl: function (data, file, frame) {
			var result = '', type = this.getFileType(file);
			if (type == 'doc' || type == 'excel' || type == 'pp') {
				var params = {
					file: file.name,
					id: file.PartID,
					mode: 'msv',
					tnef_id: file.tnef_id,
					type: type
				};
				if (frame) {
					$.extend(params, {
						frame: 1
					});
					result = '/cgi-bin/getattach?' + ajs.toQuery(params);
				} else {
					result = '//' + data.MainMailHost + '/cgi-bin/getattach?' + ajs.toQuery(params);
				}
			}
			return result;
		},

		getMRVUrl: function (data, file, frame) {
			var result = '', type = this.getFileType(file);
			if (type == 'doc' || type == 'excel' || type == 'pp') {
				var params = {
					file: file.name,
					id: file.PartID,
					mode: 'mrv',
					tnef_id: file.tnef_id,
					type: type
				};
				if (frame) {
					$.extend(params, {
						frame: 1
					});
					result = '/cgi-bin/getattach?' + ajs.toQuery(params);
				} else {
					result = '//' + data.MainMailHost + '/cgi-bin/getattach?' + ajs.toQuery(params);
				}
			}
			return result;
		},

		getFileType: function (file) {
			var type = 'other', ext = file.ext;

			if (file.IsImage || file.AddPhoto || ext == 'png' || ext == 'gif' || ext == 'jpeg' || ext == 'jpg' || ext == 'bmp' || ext == 'tiff' || this.isGraphicPreview(file)) {
				type = 'image';

			} else if (ext == 'doc' || ext == 'docx' || ext == 'wpd' || ext == 'wps' || ext == 'rtf') {
				type = 'doc';

			} else if (ext == 'xls' || ext == 'xlsx' || ext == 'xlsb' || ext == 'xlsm' || this.isCSVPreview(file)) {
				type = 'excel';

			} else if (ext == 'ppt' || ext == 'pptx' || ext == 'pps' || ext == 'ppsx') {
				type = 'pp';

			} else if (ext == 'pdf') {
				type = 'pdf';

			} else if (ext == 'zip' || ext == 'rar' || ext == '7z' || file.ContentType == 'application/zip' || file.ContentType == 'application/x-rar-compressed') {
				type = 'archive';

			} else if (file.ContentText && ext == 'txt') {
				type = 'text';
			}

			return type;
		},

		getFileIconType: function (file) {
			var type = file.ext;

			if (file.IsMp3) {
				type = 'mp3';

			} else if (file.ContentType == 'application/zip') {
				type = 'zip';

			} else if (file.ContentType == 'application/x-rar-compressed') {
				type = 'rar';
			}

			return type;
		}
	});

	jsLoader.loaded('{mailru.attachViewer}mailru.FullAttachViewer.Utils', 1);

// data/ru/images/js/ru/jsCore/Projects/mail.ru/AttachViewer/mailru.FullAttachViewer.Utils.js end

// data/ru/images/js/ru/jsCore/Projects/mail.ru/AttachViewer/mailru.FullAttachViewer.Layer.js start


// data/ru/images/js/ru/jsCore/Projects/mail.ru/AttachViewer/mailru.FullAttachViewer.Slider.js start


/**
	 * @class mailru.FullAttachViewer.Slider
	 */
	jsClass
	.create('mailru.FullAttachViewer.Slider')
	.extend(jQueryEvent)
	.statics({

		iOSDevice: /iPhone|iPod|iPad/i.test(navigator.userAgent),

		defaultOptions: {
			slider_max_height: 150,
			slider_tmpl_url: 'pages/attachviewer/attachviewer__slider',
			slider_show_speed: 500,
			selectedItemClass: 'attachviewer__slider__list__item_selected',
			easing: 'swing',
			speed: 500
		}
	})
	.methods({

		files: [],

		__construct: function(options) {
			this.options = $.extend({}, mailru.FullAttachViewer.Slider.defaultOptions, options);

			if (mailru.NewAttachViewerPopup) {
				this.options.slider_max_height = 123;
			}

			this.controlClickObserver = this._controlClick.bind(this);
			this.listClickObserver = this._listClick.bind(this);
			this.rootClickObserver = this._rootClick.bind(this);
			this.showSliderCompleteObserver = this._showSliderComplete.bind(this);
			this.hideSliderCompleteObserver = this._hideSliderComplete.bind(this);

			this.$document = $(document);
			this.$box = $('#AttachViewer');
			this.$div = $('.js-layerSlider', this.$box).click(this.listClickObserver);
			this.$switcher = $('.js-sliderSwitcher', this.$box).mousedown(false);

			if (mailru.FullAttachViewer.Slider.iOSDevice) {
				this.$div.css('height', this.options.slider_max_height);
			}
		},

		redraw: function (files, callback) {
			this.files = files;
			this.offset = this.selectedIndex = 0;

			if (this.$controls) {
				this.$controls.unbind('click', this.controlClickObserver);
			}

			this.$switcher.unbind('click', this.rootClickObserver);

			this.$div.fest(this.options.slider_tmpl_url, { Files: this.files }, function() {
				this.$prev  = $('.js-sliderPrev',  this.$div);
				this.$next  = $('.js-sliderNext',  this.$div);
				this.$inner = $('.js-sliderInner', this.$div);
				this.$list  = $('.js-sliderList',  this.$div);

				this.$controls = this.$prev.add(this.$next);

				this.$controls.bind('click', this.controlClickObserver).mousedown(false);

				if (this.files.length > 1) {
					this.$switcher.bind('click', this.rootClickObserver).addClass('attachviewer__fileinfo_active');
				} else {
					this.$switcher.removeClass('attachviewer__fileinfo_active');
				}

				callback();

			}.bind(this));
		},

		setSelected: function (index) {
			this.selectedIndex = index;
			if (this.$previosSelected) {
				this.$previosSelected.removeClass(this.options.selectedItemClass);
			}
			this.$previosSelected = this.$list.find('.js-item:eq(' + index + ')').addClass(this.options.selectedItemClass);
		},

		setSlide: function (index, animate) {
			var min = 0, max = this.files.length - this.itemCount;
			this.$prev.toggle(index > min);
			this.$next.toggle(index < max);
			if (this.files.length > this.itemCount) {
				this.offset = index = Math.min(max, Math.max(index, min));
				var offset = -(index * this.itemWidth);
				if (animate) {
					this.$list.animate({'left': offset}, this.options.speed, this.options.easing);
				} else {
					this.$list.css('left', offset);
				}
			}
		},

		show: function(animate) {
			if (this.visible && !this.isHideAnimate) return;

			this.triggerHandler('startShow');

			this.isHideAnimate = 0;
			this.$div.stop(true, false);

			if (animate) {
				this.isShowAnimate = 1;
				this.$div.show().animate({
					height: this.options.slider_max_height
				}, this.options.slider_show_speed, this.showSliderCompleteObserver);
			} else {
				this.visible = 1;
				this.$div.css('height', this.options.slider_max_height).show();
			}

			var itemGeometry = this.getFirstItemGeometry();

			this.itemWidth = itemGeometry[0];
			this.itemHeight = itemGeometry[1];

			this.$inner.css({
				height: this.itemHeight
			});

			this.itemCount = Math.floor(this.$inner.css('width', '').width() / this.itemWidth);
			this.$inner.css('width', this.itemWidth * this.itemCount);
		},

		hide: function(animate) {
			if (!this.visible && !this.isShowAnimate) return;

			this.isShowAnimate = 0;
			this.$div.stop(true, false);

			if (animate) {
				this.isHideAnimate = 1;
				this.$div.animate({
					height: 0
				}, this.options.slider_show_speed, this.hideSliderCompleteObserver);
			} else {
				this.visible = 0;
				this.$div.hide().css('height', 0);
			}
		},

		getFirstItemGeometry: function () {
			var $firstChild = this.$list.find('.js-item:first');

			if($firstChild.length) {
				return [
					$firstChild[0].offsetWidth  + (parseInt($.css($firstChild[0], 'marginLeft')) || 0) + (parseInt($.css($firstChild[0], 'marginRight' )) || 0),
					$firstChild[0].offsetHeight + (parseInt($.css($firstChild[0], 'marginTop' )) || 0) + (parseInt($.css($firstChild[0], 'marginBottom')) || 0)
				];

			} else {
				return [0,0];
			}
		},

		resize: function () {
			if (this.visible || this.isShowAnimate) {
				this.hide();
				this.show();
			}
			this.setSlide(this.selectedIndex);
		},

		_showSliderComplete: function () {
			this.isShowAnimate = 0;
			this.visible = 1;
		},

		_hideSliderComplete: function () {
			this.isHideAnimate = this.visible = 0;
			this.$div.hide();
		},

		_rootClick: function (evt) {
			if (!$(evt.target).closest('a', this.$switcher).length) {
				this[!this.isHideAnimate && (this.visible || this.isShowAnimate) ? 'hide' : 'show'](true);
				evt.preventDefault();
			}
		},

		_controlClick: function (evt) {
			var $target = $(evt.target);
			if ($target.hasClass('js-sliderPrev')) {
				this.setSlide(this.offset - this.itemCount + 1, true);
				this.triggerHandler('prev');
			} else {
				this.setSlide(this.offset + this.itemCount - 1, true);
				this.triggerHandler('next');
			}
		},

		_listClick: function (evt) {
			var $target = $(evt.target);
			var $item = $target.closest('.js-item', this.$div);
			if ($item.length) {
				this.triggerHandler('click', [$item.index()]);
				evt.preventDefault();
			}
		}
	});

	jsLoader.loaded('{mailru.attachViewer}mailru.FullAttachViewer.Slider', 1);

// data/ru/images/js/ru/jsCore/Projects/mail.ru/AttachViewer/mailru.FullAttachViewer.Slider.js end

/**
	 * @class mailru.FullAttachViewer.LayerMainDiv
	 */
	jsClass
	.create('mailru.FullAttachViewer.LayerMainDiv')
	.extend(jQueryEvent)
	.statics({

		defaultOptions: {
			offset: {
				top: 30,
				bottom: 15
			}
		}
	})
	.methods({

		__construct: function() {

			this.options = $.extend({}, mailru.FullAttachViewer.LayerMainDiv.defaultOptions);

			if (mailru.NewAttachViewerPopup) {
				this.options.offset.bottom = 37;
			} else {
				this.fade = LayerFade.getInstance();
			}

			this.slider = new mailru.FullAttachViewer.Slider();

			this.hideObserver = this.hide.bind(this);
			this.resizeObserver = this._resize.bind(this);
			this.controlClickObserver = this._controlClick.bind(this);

			this.$window = $(window);
			this.$document = $(document);
			this.$div = $('#AttachViewer');
			this.$scrollArea = $('body,#ScrollBody');

			this.$close = $('.js-layerClose', this.$div);
			this.$prev = $('.js-layerPrev', this.$div);
			this.$next = $('.js-layerNext', this.$div);
			this.$name = $('.js-layerNameText', this.$div);
			this.$nameIcon = $('.js-layerNameIcon', this.$div);
			this.$pager = $('.js-layerPager', this.$div);
			this.$downloadLink = $('.js-downloadLink', this.$div);
			this.$controls = this.$prev.add(this.$next).add(this.$close);

			this.$controls.click(this.controlClickObserver).mousedown(false);

			if (this.fade) {
				this.fade.bind({
					hide: this.hideObserver
				});
			}

			this.enableHide();
		},

		_resize: function() {
			this._update();
			this.slider.resize();
			this.triggerHandler('resize');
		},

		_update: function() {
			var windowHeight = ajs.windowHeight();
			var windowWidth = ajs.windowWidth();
			var scrollTop = ajs.scrollTop();
			var h = windowHeight - (this.options.offset.top + this.options.offset.bottom);
			var y = Math.max(scrollTop + this.options.offset.top, scrollTop + ((windowHeight - h) / 2));

			if (mailru.NewAttachViewerPopup) {
				y = this.options.offset.top;
			}

			this.$div.css({height: h, top: y});

			this.$scrollArea.css('overflow', windowWidth > 960 && h > 500 ? 'hidden' : '');
		},

		_controlClick: function(evt) {
			var $target = $(evt.target);
			if ($target.closest('.js-layerClose', this.$div).length) {
				if (!mailru.NewAttachViewerPopup) {
					this.hide();
				}
				this.triggerHandler('close');
			} else if ($target.hasClass('js-layerPrev')) {
				this.triggerHandler('prev');
			} else if ($target.hasClass('js-layerNext')) {
				this.triggerHandler('next');
			}
			evt.preventDefault();
		},

		show: function() {
			if (!this.visible) {
				this.visible = 1;
				this.$div.show();
				if (this.fade) {
					this.fade.show();
				}
				this._update();
				this.slider.show();
				this.$div.addClass('attachviewer_visible');  // Animation
				this.$window.bind('resize', this.resizeObserver);
				this.triggerHandler('show');
			}
			return this;
		},

		hide: function() {
			if (this.visible) {
				this.visible = 0;
				if (mailru.NewAttachViewerPopup) {
					window.close();
				} else {
					this.$div.hide();
					this.$div.removeClass('attachviewer_visible');
					if (this.fade) {
						this.fade.hide();
					}
					this.slider.hide();
					this.$scrollArea.css('overflow', '');
				}
				this.$window.unbind('resize', this.resizeObserver);
				this.triggerHandler('hide');
			}
			return this;
		},

		disableHide: function () {
			this.fix = 1;
			this.$close.hide();
			$.hotkeys.off('esc', this.hideObserver);
			return this;
		},

		enableHide: function () {
			this.fix = 0;
			this.$close.show();
			$.hotkeys.on('esc', this.hideObserver);
			return this;
		}
	});


	/**
	 * @class mailru.FullAttachViewer.Layer
	 */
	jsClass
	.create('mailru.FullAttachViewer.Layer')
	.extend(jQueryEvent)
	.methods({

		__construct: function() {
			this.mainDiv = mailru.FullAttachViewer.LayerMainDiv.getInstance();
			this.hideObserver = this.hide.bind(this);
			this.$div = $('.js-layerInner', this.mainDiv.$div);
			this.mainDiv.bind({
				hide: this.hideObserver
			});
		},

		show: function() {
			if (!this.visible) {
				this.visible = 1;
				this.$div.show();
				this.mainDiv.show();
				this.triggerHandler('show');
			}
			return this;
		},

		hide: function() {
			if (this.visible) {
				this.visible = 0;
				this.$div.hide();
				this.mainDiv.hide();
				this.triggerHandler('hide');
			}
			return this;
		}
	});

	jsLoader.loaded('{mailru.attachViewer}mailru.FullAttachViewer.Layer', 1);

// data/ru/images/js/ru/jsCore/Projects/mail.ru/AttachViewer/mailru.FullAttachViewer.Layer.js end

// data/ru/images/js/ru/jsCore/Projects/mail.ru/AttachViewer/mailru.FullAttachViewer.Preload.js start

/**
 * @object  mailru.FullAttachViewer.Preload
 * @author  Alexander Abashkin <a.abashkin@corp.mail.ru>
 */


/**
	 * @class mailru.FullAttachViewer.Preload
	 */
	jsClass
	.create('mailru.FullAttachViewer.Preload')
	.statics({
		/** @name files */
		files: [],

		/**
		 * @name init
		 * @param {Number} index
		 * @param {Object | String} parent
		 * @description
		 * [1, 2, 3, 4, 5] -> [2, 3, 4] -> [2, 4]
		 *
		 **/
		init: function(index, parent) {
			// IE may throws and exception
			try {
				// Set the remaining files
				//$('.w-attachviewer__viewer__image img', parent).load(function() {
					// Get target range (next and previous)
					var files = this.files.splice(index <= 0 ? 0 : index - 1, 3);

					// Remove the current index
					files.splice(1, 1);

					this.preload(files);
				//}
				//.bind(this));
			}
			catch (error) {
				//..
			}
		},

		/**
		 * @name preload
		 * @param {Array} files
		 * @returns {Number}
		 **/
		preload: function(files) {
			if (!files.length)
				return -1;

			var namespace = 'preloadIMG-' + $.expando;

			// Create wrapper
			if (!$(namespace)[0])
				$('<div />', {id: namespace}).hide().appendTo('body');

			// Append images
			$.each(files, function() {
				$('<img />', {src: this}).appendTo('#' + namespace);
			});

			return 0;
		}
	});

	jsLoader.loaded('{mailru.attachViewer}mailru.FullAttachViewer.Preload', 1);

// data/ru/images/js/ru/jsCore/Projects/mail.ru/AttachViewer/mailru.FullAttachViewer.Preload.js end

// data/ru/images/js/ru/jsCore/utils/PDF.js start

if (!('ajs' in window)) {
	ajs = {};
}

/**
 * from http://pdfobject.com/
 * @class ajs.PDF
 */
(function (ajs) {

	var PDF = {};

	//Tests specifically for Adobe Reader (aka Acrobat) in Internet Explorer
	var hasReaderActiveX = function () {
		var axObj = null;
		if (window.ActiveXObject) {
			try {
				axObj = new ActiveXObject("AcroPDF.PDF");
			} catch( e ) {}

			//If "AcroPDF.PDF" didn't work, try "PDF.PdfCtrl"
			if (!axObj) {
				try {
					axObj = new ActiveXObject("PDF.PdfCtrl");
				} catch( e ) {}
			}
			//If either "AcroPDF.PDF" or "PDF.PdfCtrl" are found, return true
			if (axObj !== null) {
				return true;
			}
		}
		//If you got to this point, there's no ActiveXObject for PDFs
		return false;
	};

	//Tests specifically for Adobe Reader (aka Adobe Acrobat) in non-IE browsers
	var hasReader = function () {
		if( navigator.plugins ){
			var i, n = navigator.plugins, count = n.length, regx = /Adobe Reader|Adobe PDF|Acrobat/gi;
			for (i = 0; i < count; i++) {
				if (regx.test(n[i].name)) {
					return true;
				}
			}
		}
		return false;
	};

	//Detects unbranded PDF support
	var hasGeneric = function () {
		var plugin = navigator.mimeTypes["application/pdf"];
		return (plugin && plugin.enabledPlugin);
	};

	//Determines what kind of PDF support is available: Adobe or generic
	var pluginFound = function () {
		var type = null;
		if (hasReader() || hasReaderActiveX()) {
			type = "Adobe";
		} else if (hasGeneric()) {
			type = "generic";
		}
		return type;
	};

	var embed = function (targetID, options) {
		if (PDF.disabled) {
			return false;
		}
		options = options || {};
		options.url = options.url || '';
		options.width = options.width || '100%';
		options.height = options.height || '100%';

		//Allow users to pass an element OR an element's ID
		var targetNode = (targetID.nodeType && targetID.nodeType === 1) ? targetID : document.getElementById(targetID);

		//Ensure target element is found in document before continuing
		if (!targetNode) {
			return false;
		}
		targetNode.innerHTML = '<object	data="' + options.url + '" type="application/pdf" width="' + options.width + '" height="' + options.height + '"></object>';
		return targetNode.getElementsByTagName("object")[0];
	};

	PDF.type = pluginFound();
	PDF.disabled = !PDF.type;
	PDF.embed = embed;

	ajs.PDF = PDF;

})(ajs);

jsLoader.loaded('{utils}PDF', 1);
 

// data/ru/images/js/ru/jsCore/utils/PDF.js end

/**
	 * @class mailru.FullAttachViewer.Viewer
	 */
	jsClass
	.create('mailru.FullAttachViewer.Viewer')
	.statics({

		defaultOptions: {
			isShort: !mailru.AttachViewStyle,

			preview_list_tmpl_id: '#AttachViewer__previewList_ejs',
			preview_short_list_tmpl_id: '#AttachViewer__previewShortList_ejs',

			archive_tree_tmpl_id: 'attachviewer__archive__tree',

			type_other_tmpl_id:   'attachviewer__other',
			type_image_tmpl_id:   'attachviewer__image',
			type_text_tmpl_id:    'attachviewer__text',
			type_pdf_tmpl_id:     'attachviewer__pdf',
			type_msdoc_tmpl_id:   'attachviewer__MSDoc',
			type_archive_tmpl_id: 'attachviewer__archive'
		}

	})
	.methods({

		files: [],
		links: [],

		archiveCache: {},
		layerCache: {},

		imageData: {},

		__construct: function (options) {
			this.options = $.extend({}, mailru.FullAttachViewer.Viewer.defaultOptions, options);
			this.utils = mailru.FullAttachViewer.Utils;
			this.isShort = this.options.isShort;
		},

		_initialize: function () {

			this.listClickObserver = this._listClick.bind(this);
			this.switcherClickObserver = this._switcherClick.bind(this);
			this.innerMouseMoveObserver = this._innerMouseMove.bind(this);
			this.imageClickObserver = this._imageClickObserver.bind(this);
			this.resizeControlClickObserver = this._resizeControlClickObserver.bind(this);
			this.resizeControlHoverObserver = this._resizeControlHoverObserver.bind(this);
			this.keyNavigationObserver = this._keyNavigationObserver.bind(this);
			this.loadPlayerClickObserver = this._loadPlayerClick.bind(this);

			if (!this.options.popup) {
				this.documentClickObserver = this._documentClick.bind(this);
				this.beforeUnloadObserver = this._beforeUnload.bind(this);
			}

			this.$window = $(window);
			this.$document = $(document);

			this.layer = new mailru.FullAttachViewer.Layer(this.options);

			this.layer.mainDiv.bind('prev next close hide show resize', {scope: this}, function (evt) {
				var scope = evt.data.scope, type = evt.type;
				if (type == 'prev') {
					scope.setFile(scope.index - 1);
					scope.$window.triggerHandler('attachViewerPreviewPrevClick.attachViewer');
				} else if (type == 'next') {
					scope.setFile(scope.index + 1);
					scope.$window.triggerHandler('attachViewerPreviewNextClick.attachViewer');
				} else if (type == 'close') {
					scope.$window.triggerHandler('attachViewerPreviewCloseClick.attachViewer');
					scope.$window[0].close();
				} else if (type == 'show') {
					scope.$document
						.bind('click', scope.documentClickObserver)
						.bind('keydown', scope.keyNavigationObserver)
					;
					scope.$window.bind('beforeunload', scope.beforeUnloadObserver);
				} else if (type == 'hide') {
					if (scope.$previosLayer && scope.removePrevios) {
						scope.$previosLayer.remove();
					}

					scope.$document
						.unbind('click', scope.documentClickObserver)
						.unbind('keydown', scope.keyNavigationObserver)
					;

					scope.$window.unbind('beforeunload', scope.beforeUnloadObserver);
					jsHistory.set(jsHistory.get().replace(/([&\?]_av=)[^&]+/, '$1'), null, true);
				} else if (type == 'resize') {
					scope._resize();
				}

				if (type != 'resize') {
					mailru.FullAttachViewer.Preload.init(scope.index, this.layer);
				}
			});

			this.layer.mainDiv.slider.bind('startShow click prev next', {scope: this}, function (evt, index) {
				var scope = evt.data.scope, type = evt.type;
				if (type == 'prev') {
					scope.$window.triggerHandler('attachViewerSliderPrevClick.attachViewer');
				} else if (type == 'next') {
					scope.$window.triggerHandler('attachViewerSliderNextClick.attachViewer');
				} else if (type == 'click') {
					if (index != scope.index) {
						scope.setFile(index);
					}
					scope.$window.triggerHandler('attachViewerSliderListClick.attachViewer');
				} else if (type == 'startShow') {
					scope.$resizeControl.hide();
				}
			});

			this.$resizeControl = $('.js-layerResize', this.layer.mainDiv.$div).bind({
				'mouseover mouseout': this.resizeControlHoverObserver,
				'click': this.resizeControlClickObserver,
				'mousedown': false
			});

			this.isInitialize = 1;
		},

		redraw: function (selector, data, builded) {
			this.destroy();
			this.setData(data);

			if (this.data.NewAttachViewer) {
				this.$container = $(selector)
					.bind('click', this.listClickObserver)
					.delegate('.js-switcher', 'click', this.switcherClickObserver)
				;
			}

			if (!builded) {
				this.drawTemplate();
			}

			if(this.isShort && mailru.AudioPlayerApi){
				// init players
				this.$container.find('.js-loadplayer, .js-play').bind('click', this.loadPlayerClickObserver);
			}
		},

		getInfoByPartID: function (partID) {
			var data = {
				index: null,
				current: null
			};

			if (!partID || partID === 'NaN') {
				partID = 0;
			}

			if (/^\d+$/.test(partID)) {
				data.index = partID|0;
				data.current = this.files[data.index];
			} else {
				for (var file, i = this.files.length; i-- ; ) {
					file = this.files[i];
					if (file.PartID === partID) {
						data.index = i;
						data.current = file;
						break;
					}
				}
			}
			return data;
		},

		setData: function (data) {
			if (!this.isInitialize) {
				this._initialize();
			}

			this.layerGeometry = {width: 0, height: 0};
			this.layerCache = {};
			this.archiveCache = {};
			this.imageData = {};

			this.files = [];
			this.links = [];

			this.data = $.extend({
				AvStatusBar: mailru.AvStatusBar,
				NewAttachViewer: mailru.NewAttachViewer,
				Id: '',
				Subject: '',
				FromName: '',
				files_status: '',
				MainMailHost: '',
				MailAttachZipHost: '',
				MailAttachPreviewHost: '',
				AttachAllfiles_name: '',
				AttachAllfiles_AttachHost: '',
				AttachAllfiles_MsgId: '',
				AttachAllfiles_PartsId: '',
				Winmail_IsRtf: 0,
				Winmail_name: '',
				Winmail_Channel: '',
				Winmail_PartID: '',
				Winmail_hasAttach: 0,
				Winmail_size: 0,
				Winmail_URLFileName: ''
			}, data);

			if(!this.data.Subject)
				this.data.Subject = '&lt;'+Lang.get('message.email.untitled')+'&gt;';
			this.data.Subject = replaceEntity(this.data.Subject);
			this.data.FromName = replaceEntity(this.data.FromName);

			this.data.archiveDownloadUrl = this.utils.getAllFilesDownloadUrl(this.data);
			this.data.MailAttachPreviewHost = String(this.data.MailAttachPreviewHost).replace(/^af\w*\./, 'apf.');

			this.layer.$div.empty();

			if ($.isArray(this.data.Attachments)) {
				var fileData = null;
				$.each(this.data.Attachments, function (k, v) {
					fileData = this.utils.createFileDescription(this.data, v, k);
					this.files.push(fileData);
					mailru.FullAttachViewer.Preload.files.push(fileData.imageUrl);
				}.bind(this));
			}

			if ($.isArray(this.data.Attachlinks)) {
				$.each(this.data.Attachlinks, function (k, v) {
					this.links.push(this.utils.createLinkDescription(this.data, v, k));
				}.bind(this));
			}

			if (this.options.popup) {
				this.layer.mainDiv.slider.redraw(this.files, function () {
					this.$window.triggerHandler('attachViewerRedraw.attachViewer', [this.files, this.links]);
				}.bind(this));
			}
		},

		_bindOnHistoryChange: function () {
			jsHistory.change(function (hash, force, data) {
				var partID;
				if (data) {
					partID = data.attachViewerFilePartID;
				} else {
					var matches = hash.match(/[&\?]_av=([^&]+)/);
					if (matches) {
						partID = decodeURIComponent(matches[1]);
					}
				}
				if (partID && this.getInfoByPartID(partID).current) {
					this.showFile(partID);
				}
			}.bind(this), true);
		},

		drawTemplate: function () {
			var templateId = this.isShort ? this.options.preview_short_list_tmpl_id : this.options.preview_list_tmpl_id;

			this.$container.tpl(templateId, $.extend({}, this.data, {
				Attachments: this.files,
				Attachlinks: this.links
			}));
		},

		showFile: function (partID) {

			if (!this.bindOnHistoryChange) {
				this.bindOnHistoryChange = 1;
				this._bindOnHistoryChange();
			}

			var info = this.getInfoByPartID(partID);
			var file = info.current;
			var index = info.index;
			var layer = this.layer;
			var layerMainDiv = layer.mainDiv;
			var iconType = 'other';
			var fileIconType = this.utils.getFileType(file);

			clearTimeout(this.imageMouseMoveTimeout);
			clearTimeout(this.imageResizeTimeout);

			this.scroll = false;
			this.index = index;
			this.file = file;
			this.type = this.utils.getFileType(file);

			if (this.type == 'image') {
				iconType = 'photo';
			} else if (this.type == 'doc' || this.type == 'excel' || this.type == 'pp') {
				iconType = 'doc';
			} else if (fileIconType == 'mp3') {
				iconType = 'music';
			}

			if (this.type == 'image') {
				this.scroll = !!(this.imageData[this.index] && this.imageData[this.index].scroll);
			}

			this.$resizeControl.toggleClass('attachviewer__resize_minus', this.scroll).hide();
			layer.$div.toggleClass('attachviewer__inner_scroll', this.scroll);
			layer.$div.removeClass('attachviewer__inner_hidden-overflow');

			layer.show();

			layerMainDiv.$prev.toggle(index > 0);
			layerMainDiv.$next.toggle(index < this.files.length - 1);
			layerMainDiv.$nameIcon.replaceClass(/\s*icon_type\-[^\s]+/, '').addClass('icon_type-' + iconType);
			layerMainDiv.$name.text(file.name);
			layerMainDiv.$downloadLink.attr('href', file.downloadUrl);
			layerMainDiv.$pager.text((index + 1)+ ' '+Lang.get('attachViewer.paging.from')+' ' +this.files.length);
			layerMainDiv.slider.hide();
			layerMainDiv.slider.setSelected(index);

			this._create(this.index, this.type, file);

			this._title();
		},

		setFile: function (index) {
			var file = this.files[index];
			if (file) {
				var host = location.protocol + '//' + location.host;
				var url = jsHistory.get().replace(/[&\?]_av=[^&]+/, '').replace(new RegExp('^((' + String.preg_quote(host) + ')?/cgi-bin/)?'), '');
				jsHistory.set(url + (url.indexOf('?') === 0 ? '?' : '&') + '_av=' + file.PartID, {
					attachViewerFilePartID: file.PartID
				}, true);
			}
		},

		setMode: function (isShort) {
			if (isShort != this.isShort) {
				this.isShort = isShort;
				this.drawTemplate();
				if (isShort && mailru.AudioPlayerApi) {
					this.$container.find('.js-loadplayer, .js-play').bind('click', this.loadPlayerClickObserver);
				}
				mailru.Ajax({
					type: 'POST',
					url: '/cgi-bin/ajax_modifyprofile?ajax_call=1&func_name=' + (isShort ? 'new_attach_viewer_off' : 'new_attach_viewer_on')
				});
			}
		},

		_title: function () {
			var data = {
				name: this.file.name,
				subject: this.data.Subject,
				email: mailru.useremail
			};
			document.title = Lang.get('title.ajax_attach_action').replace(/#(\w+)#/gi, function (a, key) {
				return data[key] || '';
			});
		},

		_create: function (index, type, file) {
			var options = this.options, event;
			var templateId = options.type_other_tmpl_id;
			var templateData = $.extend(true, {}, {
				data: this.data,
				file: file
			});
			var isMsdoc = (type == 'doc' || type == 'excel' || type == 'pp');
			var isPDF = (type == 'pdf' && !ajs.PDF.disabled && !$.browser.mozilla);

			var $inner = this.layerCache[index];

			if (this.$previosLayer) {
				this.$previosLayer[this.removePrevios ? 'remove' : 'hide']();
			}

			if ($inner) {
				$inner.show();

			} else {
				$inner = $('<div/>', {width: '100%', height: '100%'}).appendTo(this.layer.$div);

				if (!(isMsdoc || isPDF)) {
					this.layerCache[index] = $inner;
				}

				if (type == 'image') {
					templateId = options.type_image_tmpl_id;
					this.layer.$div.addClass('attachviewer__inner_noscroll');

				} else if (type == 'text') {
					templateId = options.type_text_tmpl_id;

				} else if (isPDF) {
					templateId = options.type_pdf_tmpl_id;

				} else if (isMsdoc) {
					templateId = options.type_msdoc_tmpl_id;

					if ((mailru['MRVMSDocPreview'] && type == "doc" && (file.ext == "doc" || file.ext == "docx")) || (mailru['MRVMSExcelPreview'] && type == "excel" && (file.ext == "xls" || file.ext == "xlsx")) || this.utils.isCSVPreview(file) || (mailru['MRVMSRtfPreview'] && file.ext == "rtf") || (mailru['MRVMSPptPreview'] && (file.ext == "pptx" || file.ext == "ppt"))) {
						$.extend(templateData, {
							previewMSVUrl: this.utils.getMRVUrl(this.data, file, true)
						});
					} else {
						$.extend(templateData, {
							previewMSVUrl: this.utils.getMSVUrl(this.data, file, true)
						});
					}

					if (type == 'doc') {
						event = 'showWord.officeWebApps';
					} else if (type == 'excel') {
						event = 'showExcel.officeWebApps';
					} else if (type == 'pp') {
						event = 'showPowerPoint.officeWebApps';
					}

				} else if (type == 'archive') {
					templateId = options.type_archive_tmpl_id;
				}

				if (event) {
					this.$window.triggerHandler(event);
				}

				templateData.mail = this.data; // FIXME
				templateData.lang = Lang.get('Attachviewer')

				$inner.fest('pages/attachviewer/' + templateId, templateData, function() {
					if (type == 'image') {
						var $viewer = $('.attachviewer__viewer_image', $inner);
						var $image = $('img', $viewer);

						if (this.imageData[this.index] && this.imageData[this.index].geometry) {
							$inner.bind('mousemove', this.innerMouseMoveObserver);

						} else {
							var eventData = {index: this.index, container: $inner};

							if ($image && $image[0]) {
								if ($image[0].complete) {
									this._imageLoad({target: $image[0], data: eventData});
								} else {
									$image.bind('load', eventData, this._imageLoad.bind(this));
								}
							}
						}

						if (this.index < this.files.length - 1) {
							$viewer.bind('click', this.imageClickObserver);
						} else {
							$viewer.addClass('attachviewer__viewer_disabled');
						}

					} else if (!mailru.MRVMSDocPreview && type == 'doc' && mailru.IsCorpUser) {

						if (this.$testframe) {
							this.$testframe.remove();
						}

						this.$testframe = $('<iframe src="' + this.utils.getMRVUrl(this.data, file, true) + '"/>')
							.hide()
							.appendTo(document.body);

					} else if (!mailru.MRVMSExcelPreview && type == 'excel' && mailru.IsCorpUser) {

						if (this.$testframe) {
							this.$testframe.remove();
						}

						this.$testframe = $('<iframe src="' + this.utils.getMRVUrl(this.data, file, true) + '"/>')
							.hide()
							.appendTo(document.body);

					} else if(type == 'archive') {
						$inner.delegate('.js-ViewSource', 'click', function(e) {
							// show loading indicator
							$(e.currentTarget).addClass('attachviewer__viewer__show-source_loading');

							$.getJSON("/cgi-bin/att_zip?ajax_call=1&func_name=zip_list&data=[\"" + this.file.PartID + "\"]", function (R) {
								if(R[1] == 'OK' && R[2] && R[2][0] != null) {
									var tree = this.utils.createFilesTree(this.data, R);

									var treeWrapper = $inner.find('.attachviewer__viewer__archive-files');
									treeWrapper.fest('pages/attachviewer/' + options.archive_tree_tmpl_id, {
										files: tree,
										lang: templateData.lang

									}, function() {
										this.layer.$div.addClass('attachviewer__inner_hidden-overflow');
										$inner.addClass('attachviewer__inner_archive-source');

										var rowHeight = treeWrapper.find('.messageline:first').height();

										treeWrapper.delegate('.js-toggle-folder', 'click', function() {
											var id = $(this).attr('data-id');

											var node = tree.get(id);
											node.toggleOpen();

											$(this).attr('title', $(this).attr(node.isOpen ? 'data-hide-title' : 'data-show-title'));
											$(this).find('.messageline__filetype__icon').toggleClass('icon_filetype_folder icon_filetype_folder_opened');
											$(this).parent().toggleClass('messagelist_fileslist_short__files__file_folder messagelist_fileslist_short__files__file_folder_opened');

											$(this).parents('.messageline').each(function(i,row) {
												var $row = $(row)

												var count = Array.filter(tree.getDescendantsOrSelf($row.find('.js-toggle-folder:first').attr('data-id')), function(node) {
													return node.isVisible()
												}).length;

												$row.height(count * (rowHeight + 1));
											})

										})

									}.bind(this));
								}

							}.bind(this));

						}.bind(this))
					}
					else {
						if(mailru.AudioPlayerApi)
							$inner.find('.js-play').bind('click', {file:file, noPlay:true}, this.loadPlayerClickObserver)
								.triggerHandler('click');
					}

				}.bind(this));
			}

			this.$previosLayer = $inner;
			this.removePrevios = isMsdoc || isPDF;

			this._resize();
		},

		_keyNavigationObserver: function (evt) {
			var key = evt.keyCode;
//			if (evt.ctrlKey || evt.metaKey) {
				if (key == 37 || key == 39 ) {
					this.setFile(this.index + (key == 37 ? -1 : 1));
					evt.preventDefault();
				}
//			}
		},

		_resizeControlHoverObserver: function (evt) {
			clearTimeout(this.imageMouseMoveTimeout);
			clearTimeout(this.imageResizeTimeout);
			this.$resizeControl.stop(true, false);
			if (evt.type == 'mouseover') {
				this.$resizeControl.css('opacity', 0.5).show();
			} else {
				this.$resizeControl.css('opacity', 0.3);
			}
		},

		_resizeControlClickObserver: function (evt) {
			var $image = $('img', this.$previosLayer);
			this.layer.$div.toggleClass('attachviewer__inner_scroll', this.scroll = !this.scroll);
			if (this.scroll) {
				$image.css({
					'max-width': '',
					'max-height': ''
				});
			} else {
				$image.css({
					'max-width': this.layerGeometry.width,
					'max-height': this.layerGeometry.height
				});
			}
//			$image.css({
//				'marginTop': -($image[0].offsetHeight / 2)
//			});

			if (!this.imageData[this.index]) {
				this.imageData[this.index] = {};
			}

			this.imageData[this.index].scroll = this.scroll;

			this.$resizeControl.toggleClass('attachviewer__resize_minus', this.scroll);
			evt.stopPropagation();
		},

		_imageClickObserver: function (evt) {
			this.setFile(this.index + 1);
			this.$window.triggerHandler('attachViewerPreviewImageClick.attachViewer');
		},

		_innerMouseMove: function (evt) {
			if (this.imageData[this.index] && this.imageData[this.index].geometry) {
				if (this.imageData[this.index].geometry[0] > this.layerGeometry.width || this.imageData[this.index].geometry[1] > this.layerGeometry.height) {
					clearTimeout(this.imageMouseMoveTimeout);
					this.imageMouseMoveTimeout = setTimeout(function () {
						this.$resizeControl.stop(true, false).css('opacity', 0.3).show();
						clearTimeout(this.imageResizeTimeout);
						this.imageResizeTimeout = setTimeout(function () {
							this.$resizeControl.animate({opacity: 0}, 700, function () {
								this.$resizeControl.hide();
							}.bind(this));
						}.bind(this), 2000);
					}.bind(this), 10);
				}
			}
		},

		_listClick: function (evt) {
			var $target = $(evt.target), event;
			var $item = $target.closest('.js-item', this.$container);
			var $link = $target.closest('.js-link', $item);
			var $download = $target.closest('.js-download', $item);

			if (!$download.length && $item.length && $link.length) {

				var index = $item.index();
				var file = this.files[index];
				var type = this.utils.getFileType(file);

				if (!$link.is('a')) {
					var url = this.utils.getAttachPreviewUrl(this.data, file, index);
					try {
						var w = open(url);
						w.focus();
					}
					catch(e) {}
				}

				this.$window.triggerHandler('attachViewerListClick.attachViewer');

				if (type == 'doc') {
					event = 'clickWordLink.officeWebApps';
				} else if (type == 'excel') {
					event = 'clickExcelLink.officeWebApps';
				} else if (type == 'pp') {
					event = 'clickPowerPointLink.officeWebApps';
				}

				if (event) {
					this.$window.triggerHandler(event);
				}
			}
		},

		_switcherClick: function (evt) {
			var isShort = !this.isShort;
			this.setMode(isShort);
			this.$window.triggerHandler('attachViewerChangeModeClick.attachViewer', [isShort]);
		},

		_imageLoad: function (evt) {
			var target = evt.target, $target = $(target), index = evt.data.index;

			if (!this.imageData[index]) {
				this.imageData[index] = {};
			}

			this.imageData[index].geometry = [target.naturalWidth || target.width, target.naturalHeight || target.height];
			evt.data.container.bind('mousemove', this.innerMouseMoveObserver);
			this._resize();
			this.layer.$div.removeClass('attachviewer__inner_noscroll');
			$target.css('visibility', 'visible');
		},

		_loadPlayerClick: function(evt) {
			evt.preventDefault();
			ajs.require(['{plugins}'+'AudioPlayer'], function (){
				var $Elm = $(evt.target).closest('.js-attachAudio, .js-info').find('.js-player');
				var file = evt.data? evt.data.file : null;
				var noPlay = evt.data? evt.data.noPlay : false;
				var options = {noPlay:noPlay};
				if( file )
					options.url = file.mp3Url;

				$Elm.audioPlayer(options);
			});
		},

		_documentClick: function (evt) {
			var mainDiv = this.layer.mainDiv;
			if (!$(evt.target).closest('.js-layerWrap', mainDiv.$div).length) {
				this.layer.hide();
			}
		},

		_beforeUnload: function (evt) {
			return Lang.get('attachViewer.before_unload_confirm');
		},

		_resize: function() {
			var offset = {
				x: 0,
				y: 60 // 30 (toolbar height) x 2
			};

			if (mailru.NewAttachViewerPopup) {
				offset.x = offset.y = 0;
			}

			this.layerGeometry = {
				width: this.layer.$div.width() - offset.x,
				height: this.layer.$div.height() - offset.y
			};

			this.$resizeControl.hide();

			if (this.type == 'image') {
				if (!this.scroll) {
					var $image = $('img', this.$previosLayer);
					$image.css({
						'max-width': this.layerGeometry.width,
						'max-height': this.layerGeometry.height
					});
//					$image.css({
//						'marginTop': -($image[0].offsetHeight / 2)
//					});
				}
			} else if (this.type == 'doc' || this.type == 'excel' || this.type == 'pp') {
				$('.attachviewer__viewer__wrap', this.$previosLayer).css('height', this.layerGeometry.height + 20);
			} else if (this.type == 'pdf') {
				if ($.browser.msie) {
					var wrapHeight = this.layerGeometry.height - this.layer.mainDiv.slider.options.slider_max_height;
					if (parseInt($.browser.version) < 8) {
						wrapHeight -= 1;
					}
					$('.attachviewer__viewer_pdfwrap', this.$previosLayer).css('height', wrapHeight);
				}
			}
		},


		destroy: function (){
			if (this.$container) {
				this.$container.unbind('click', this.listClickObserver);
				this.$container.undelegate('.js-switcher', 'click', this.switcherClickObserver);
			}
		}
	});

	jsLoader.loaded('{mailru.attachViewer}mailru.FullAttachViewer.Viewer', 1);

// data/ru/images/js/ru/jsCore/Projects/mail.ru/AttachViewer/mailru.FullAttachViewer.Viewer.js end

// data/ru/images/js/ru/mailru.ExternalFlashPlayer.js start


/**
	 * @class mailru.ExternalFlashPlayer
	 */
	jsClass
	.create('mailru.ExternalFlashPlayer')
	.statics({

		players: [],

		defaultOptions: {
			width: 640,
			height: 360,
			allowVersion: '8',
			params: {allowscriptaccess: 'always', allowfullscreen: 'true'},
			vars: {},
			attrs: {},
			queryParams: {}
		},

		getPlayerDataByUrl: function (url) {
			var result, matches;
			$.each(this.players, function (k, player) {
                $.each([].concat(player.LINK_PATTERN), function (k, pattern) {
					matches = url.match(pattern);
                    if (matches) {
                        result = {player: player, data: matches};
                        return false;
                    }
                });
                if (result) {
                    return false;
                }
			});
			return result;
		},

		showPlayerLayerByUrl: function (url){
			var data = mailru.ExternalFlashPlayer.getPlayerDataByUrl(url);

			if( data ) Layer.get('externalFlashPlayer', function (layer) {
                $('.js-link', layer.$div).attr('href', url).text(url);
                $('.js-name', layer.$div).html('&#160;');
                layer.mainDiv.$innerDiv.css('width', 670);

                var
		              player        = new data.player(data.data)
					, playerOptions = player.getOptions()
	                , $player       = $('.js-player', layer.$div).css({
					                      width:    playerOptions.width
					                    , height:   playerOptions.height
					                })
		        ;

                player.embedSWF($player);
                player.getTitle(function (title) { $('.js-name', layer.$div).text(title); });

                layer.one('hide', function () {
					$('.js-player', this.$div).empty();
					this.mainDiv.$innerDiv.css('width', '');
				});

                layer.show();

				(new Image).src = '//rs.' + mailru.SingleDomainName + '/d570141.gif?now='+ now();
            });

			return  data;
		}
	})
	.methods({

		__construct: function () {
		},

		embedSWF: function ($container) {
			var o = this.options, id = jsCore.getUniqId();
			$container.html('<span id="' + id + '"/>');
			swfobject.embedSWF(
				this.src + '?' + $.param(o.queryParams),
				id,
				o.width,
				o.height,
				o.allowVersion,
				null,
				o.vars,
				o.params,
				o.attrs,
				$.proxy(this._onLoad, this)
			);
		},

		_onLoad: function () {
		},

		getOptions: function () {
			return this.options;
		},

		getTitle: function () {
		}
	});


	/**
	 * @class mailru.ExternalFlashPlayer.YouTube
	 */
	jsClass
	.create('mailru.ExternalFlashPlayer.YouTube')
	.extend(mailru.ExternalFlashPlayer)
	.statics({

		LINK_PATTERN: [
            /^http:\/\/(?:www\.)?youtube\.(?:com|ru)\/watch\?v=([^&]+)/,
            /^http:\/\/(?:www\.)?youtu\.be\/([^\?]+)/,
            /^http:\/\/(?:www\.)?youtube\.(?:com|ru)\/user\/.*?p\/u\/\d+\/([^&]+)/
        ],

		defaultOptions: {
			queryParams: {version: '3', autoplay: '1'}
		}
	})
	.methods({

		__construct: function (data, options) {
			this.data = data;
			this.options = $.extend(true, {},
				mailru.ExternalFlashPlayer.defaultOptions,
				mailru.ExternalFlashPlayer.YouTube.defaultOptions,
				options
			);
			this.src = '//www.youtube.com/v/' + this.data[1];
		},

		getTitle: function (callback) {
			$.ajax({
				url: '//gdata.youtube.com/feeds/api/videos/' + this.data[1],
				dataType: 'jsonp',
				data: {'alt': 'json-in-script'},
				success: function(data) {
					/** @namespace data.entry */
					if (data && data.entry && data.entry.title && data.entry.title.$t) {
						callback(data.entry.title.$t);
					}
				}
			});
		}
	});
	mailru.ExternalFlashPlayer.players.push(mailru.ExternalFlashPlayer.YouTube);


	/**
	 * @class mailru.ExternalFlashPlayer.RuTube
	 */
	jsClass
	.create('mailru.ExternalFlashPlayer.RuTube')
	.extend(mailru.ExternalFlashPlayer)
	.statics({

		LINK_PATTERN: /^http:\/\/(?:www\.)?rutube\.ru\/tracks\/\d+\.html\?v=([^&]+)/,

		defaultOptions: {
			vars: {autoStart: 'true'}
		}
	})
	.methods({

		__construct: function (data, options) {
			this.data = data;
			this.options = $.extend(true, {},
				mailru.ExternalFlashPlayer.defaultOptions,
				mailru.ExternalFlashPlayer.RuTube.defaultOptions,
				options
			);
			this.src = '//video.rutube.ru/' + this.data[1];
		}
	});
	mailru.ExternalFlashPlayer.players.push(mailru.ExternalFlashPlayer.RuTube);


	/**
	 * @class mailru.ExternalFlashPlayer.Vimeo
	 */
	jsClass
	.create('mailru.ExternalFlashPlayer.Vimeo')
	.extend(mailru.ExternalFlashPlayer)
	.statics({

		LINK_PATTERN: /^http:\/\/(?:www\.)?vimeo\.com\/(\d+)/,

		defaultOptions: {
			queryParams: {server: 'vimeo.com', color: '00adef', fullscreen: '1', autoplay: '1'}
		}
	})
	.methods({

		__construct: function (data, options) {
			this.data = data;
			this.options = $.extend(true, {},
				mailru.ExternalFlashPlayer.defaultOptions,
				mailru.ExternalFlashPlayer.Vimeo.defaultOptions,
				options,
				{queryParams: {clip_id: this.data[1]}}
			);
			this.src = '//vimeo.com/moogaloop.swf';
		},

		getTitle: function (callback) {
			$.ajax({
				url: '//vimeo.com/api/oembed.json',
				dataType: 'jsonp',
				data: {url: '//vimeo.com/' + this.data[1]},
				success: function(data) {
					if (data && data.title) {
						callback(data.title);
					}
				}
			});
		}
	});
	mailru.ExternalFlashPlayer.players.push(mailru.ExternalFlashPlayer.Vimeo);


	/**
	 * @class mailru.ExternalFlashPlayer.MailRu
	 */
	jsClass
	.create('mailru.ExternalFlashPlayer.MailRu')
	.extend(mailru.ExternalFlashPlayer)
	.statics({

		LINK_PATTERN: /^http:\/\/video\.mail\.ru\/([^\/]+\/[^\/]+\/[^\/]+\/\d+)\.html/,

		defaultOptions: {
			vars: {autoplay: '1'}
		}
	})
	.methods({

		__construct: function (data, options) {
			this.data = data;
			this.options = $.extend(true, {},
				mailru.ExternalFlashPlayer.defaultOptions,
				mailru.ExternalFlashPlayer.MailRu.defaultOptions,
				options,
				{vars: {movieSrc: this.data[1]}}
			);
			this.src = '//img.mail.ru/r/video2/uvpv2.swf';
		}
	});
	mailru.ExternalFlashPlayer.players.push(mailru.ExternalFlashPlayer.MailRu);


	/**
	 * @class mailru.ExternalFlashPlayer.SmotriCom
	 */
	jsClass
	.create('mailru.ExternalFlashPlayer.SmotriCom')
	.extend(mailru.ExternalFlashPlayer)
	.statics({

		LINK_PATTERN: /^http:\/\/(?:www\.)?smotri\.com\/video\/view\/\?id=([^&]+)/,

		defaultOptions: {
			queryParams: {autoStart: 'true'}
		}
	})
	.methods({

		__construct: function (data, options) {
			this.data = data;
			this.options = $.extend(true, {},
				mailru.ExternalFlashPlayer.defaultOptions,
				mailru.ExternalFlashPlayer.SmotriCom.defaultOptions,
				options,
				{queryParams: {file: this.data[1]}}
			);
			this.src = '//pics.smotri.com/player.swf';
		}
	});
	mailru.ExternalFlashPlayer.players.push(mailru.ExternalFlashPlayer.SmotriCom);


	/**
	 * @class mailru.ExternalFlashPlayer.Dailymotion
	 */
	jsClass
	.create('mailru.ExternalFlashPlayer.Dailymotion')
	.extend(mailru.ExternalFlashPlayer)
	.statics({

		LINK_PATTERN: [
			/^http:\/\/(?:www\.)?dailymotion\.com\/video\/([^_]+)/,
			/^http:\/\/(?:www\.)?dailymotion\.com\/.*?#videoId=([^&]+)/
		],

		defaultOptions: {
			queryParams: {autoplay: '1'}
		}
	})
	.methods({

		__construct: function (data, options) {
			this.data = data;
			this.options = $.extend(true, {},
				mailru.ExternalFlashPlayer.defaultOptions,
				mailru.ExternalFlashPlayer.Dailymotion.defaultOptions,
				options
			);
			this.src = '//www.dailymotion.com/swf/' + this.data[1];
		},

		getTitle: function (callback) {
			$.ajax({
				url: '//www.dailymotion.com/services/oembed',
				dataType: 'jsonp',
				data: {url: '//www.dailymotion.com/video/' + this.data[1]},
				success: function(data) {
					if (data && data.title) {
						callback(data.title);
					}
				}
			});
		}
	});
	mailru.ExternalFlashPlayer.players.push(mailru.ExternalFlashPlayer.Dailymotion);


	/**
	 * @class mailru.ExternalFlashPlayer.Rambler
	 */
	jsClass
	.create('mailru.ExternalFlashPlayer.Rambler')
	.extend(mailru.ExternalFlashPlayer)
	.statics({

		LINK_PATTERN: /^http:\/\/vision\.rambler\.ru\/users\/(.+)\//,

		defaultOptions: {
			queryParams: {autoPlay: 'true'}
		}
	})
	.methods({

		__construct: function (data, options) {
			this.data = data;
			this.options = $.extend(true, {},
				mailru.ExternalFlashPlayer.defaultOptions,
				mailru.ExternalFlashPlayer.Rambler.defaultOptions,
				options,
				{queryParams: {id: this.data[1]}}
			);
			this.src = '//vision.rambler.ru/i/ev.swf';
		}
	});
	mailru.ExternalFlashPlayer.players.push(mailru.ExternalFlashPlayer.Rambler);


	/**
	 * @class mailru.ExternalFlashPlayer.Ivi
	 */
	jsClass
	.create('mailru.ExternalFlashPlayer.Ivi')
	.extend(mailru.ExternalFlashPlayer)
	.statics({

		LINK_PATTERN: [
			/^http:\/\/(?:www\.)?ivi\.ru\/video\/view\/\?id=([^&]+)/,
			/^http:\/\/(music)\.ivi\.ru\/watch\/.*?-(\d+)/
		],

		defaultOptions: {
			queryParams: {autoStart: '1'}
		}
	})
	.methods({

		__construct: function (data, options) {
			this.data = data;
			this.options = $.extend(true, {},
				mailru.ExternalFlashPlayer.defaultOptions,
				mailru.ExternalFlashPlayer.Ivi.defaultOptions,
				options,
				{queryParams: this.data.length > 2 ? {videoId: this.data[2], siteId: '50'} : {videoId: this.data[1]}}
			);
			this.src = '//www.ivi.ru/video/player';
		}
	});
	mailru.ExternalFlashPlayer.players.push(mailru.ExternalFlashPlayer.Ivi);


	/**
	 * @class mailru.ExternalFlashPlayer.VideoMore
	 */
	jsClass
	.create('mailru.ExternalFlashPlayer.VideoMore')
	.extend(mailru.ExternalFlashPlayer)
	.statics({

		LINK_PATTERN: /^http:\/\/(?:www\.)?videomore\.ru\/video\/tracks\/(\d+)/,

		defaultOptions: {
			vars: {autostart: 'true'}
		}
	})
	.methods({

		__construct: function (data, options) {
			this.data = data;
			this.options = $.extend(true, {},
				mailru.ExternalFlashPlayer.defaultOptions,
				mailru.ExternalFlashPlayer.VideoMore.defaultOptions,
				options,
				{vars: {config: '//videomore.ru/video/tracks/' + this.data[1] + '.xml'}}
			);
			this.src = '//videomore.ru/player.swf';
		}
	});
	mailru.ExternalFlashPlayer.players.push(mailru.ExternalFlashPlayer.VideoMore);


	jsLoader.loaded('{mailru}mailru.ExternalFlashPlayer', 1);

// data/ru/images/js/ru/mailru.ExternalFlashPlayer.js end

// data/ru/images/js/ru/utils/mailru.Utils.Message.js start


/**
	 * @class	mailru.Utils.Message
	 */
	mailru.Utils.Message = {
		callToPhone: function (number){
			try {
				return	this.getWebAgentAPI().callTo(number);
			} catch (er){}
		},


		getWebAgentAPI: function (){
			/** @namespace window.WebAgent */
			return	window.WebAgent && WebAgent.API && WebAgent.API && WebAgent.API;
		},


		canCallToPhone: function (){
			var api = this.getWebAgentAPI();
			/** @namespace api.callTo -- WebAgent.API.callTo */
			/** @namespace mailru.WebAgentEnabled  -- agent enambled */
			/** @namespace mailru.WebAgentCall -- call api avaible */
			return	mailru.WebAgentCall && mailru.WebAgentEnabled && !!(api && api.callTo);
		},


		prepareBody: function (body){
            body = body.replace(/src=['"]https?:\/\/proxy(.*?)swa\.mail[^>]+/ig, 'src="//img.'+mailru.staticDomainName+'/0.gif"');

			if( this.canCallToPhone() ){
				body = body.replace(/(<span class="js-phone-number)">/g, '$1 highlight-phone" title="'+Lang.get('readmsg.phone.highlight')+'">');
			}

//			body = this.prepareBlockquote(body);

			return	body;
		},


		prepareBlockquote: function (body){
			/** @namespace mailru.ReadMsgBlockquoteCollapsed -- defined in head__js.html */
			if( mailru.ReadMsgBlockquoteCollapsed ){
				var oq1, cq1, oq2, o = 0, blocks = 0, lvl = 0;

				do {
					oq1 = body.indexOf('<blockquote', o);
					cq1 = body.indexOf('</blockquote>', o);
					oq2 = body.indexOf('<blockquote', oq1+1);
					o   = oq1 + 1;

					if( cq1 > oq2 ){
						lvl++;
					}
					else {
						if( !lvl ) blocks++;
						if( lvl > 0 ) lvl--;
					}
				}
				while( oq1 != -1 );

				if( blocks <= 1 ){
					body = body.replace(/(<blockquote)([\s\S]+)(<\/blockquote>)/i, '<div class="js-blockquote b-blockquote"><a class="js-blockquote-ctrl b-blockquote__ctrl">'+Lang.get('readmsg.blockquote.ctrl')[0]+'</a><br/>$1 class="b-blockquote__body" $2$3</div>');
				}
			}

			return	body;
		}
	};


	jsLoader.loaded('{mailru.utils}mailru.Utils.Message', 1);

// data/ru/images/js/ru/utils/mailru.Utils.Message.js end

// data/ru/images/js/ru/utils/mailru.Utils.Fishing.js start


(function (){
		/**
		 * @class    mailru.Utils.Fishing
		 */
		var Utils = {
			initNode: function (node){
				Utils.getNodeInfo(node);
			},

			removeRedirectorFromText: function (text){
				var el = $('<div/>').innerHTML(text).each(function (x, node){
					var links = node.getElementsByTagName('a'), i = links.length;
					while( i-- ){
						this.initNode(links[i]);
					}
				}.bind(this));

				return	el[0].innerHTML;
			},

			getNodeInfo: function (node){
				var url = (node['__originUrl' + mailru.CurrentTimestamp] || node.href || node.action)+'',
					info = String.toObject( url ),
					childs = node.childNodes,
					html = node.innerHTML
				;

				try {
					/** @namespace info.js */
					if( !info.js ){
						url = url.replace(/^([^#]+)/, '$1&js=1');
					}

					if( location.protocol == 'https:' && /^http/i.test(info.url) || $.browser.msie ){
						info.redir = 1;
					}

					info.real   = url;
					info.attr   = node.href ? 'href' : 'action';

					if( info.check && info.url ){
						$(node)
							.attr({ target: '_blank', onclick: null })
							.attr(info.attr, info.url)
						;
						node['__originUrl' + mailru.CurrentTimestamp] = info.real;
						if ($.browser.msie && $.nodeName(node, 'a') && childs.length == 1 && childs[0].nodeType == 3) {
							// IEFix: restore link innerHTML
							node.innerHTML = html;
						}
					}
					else {
						info.url = url;
					}
				}
				catch( er ){
					// https://jira.mail.ru/browse/MAIL-10639
					var log = url +'.'+ (node && node.tagName || 'NULL');
					mailru.saveError('js', 'FISHING.ERROR.'+log+'.'+er.toString());
				}

				return  info;
			},


			checkEvent: function (evt){
				var type = evt.type, node = evt.currentTarget, info = Utils.getNodeInfo(node), url = info.url;

				if( type == 'mousedown' ){
					if( info.check && $.nodeName(node, 'a') ){
						// Revert original url
						var href = node.href, childs = node.childNodes, html = node.innerHTML;

						if( $.browser.msie && childs.length == 1 && childs[0].nodeType == 3 ){
							// IEFix: restore link innerHTML on mousedown
							node.href       = info.real;
							node.innerHTML  = html;
							setTimeout(function(){
								node.href       = href;
								node.innerHTML  = html;
							}, 300);
						}
						else {
							node.href   = info.real;
							setTimeout(function(){ node.href = href; }, 300);
						}
					}
				}
				else if( url ){
					if( ~url.indexOf('#') && node.hostname == location.hostname ){
						// @todo: Local anchors
						url = url.replace(/^[^#]*#/, '');
						try { url = decodeURIComponent(url) } catch (e){ url = unescape(url); }
						Utils.scrollTo('a[name="'+url+'"]', -30);
						jsHistory.build({ _: this.__anchor = url });
						evt.preventDefault();
					}
					else if( mailru.ExternalFlashPlayer.showPlayerLayerByUrl(url) || mailru.Themes.showConfirmPopup(url) ){
						// Show video player or switch theme confirm
						evt.preventDefault();
					}
					else if( info.check ){
						var res;

						if( ~url.indexOf('&') && !~url.indexOf('?') && (url.indexOf('&') < url.indexOf('#')) ){
							url = url.replace('&', '?');
						}

						node[info.attr] = url;

						$.ajax({
							  url: '/cgi-bin/link'
							, data: {
								ajaxmode: 1,
								url: url
							  }
							, async:    false
							, dataType: 'json'
							, success:  function (data){ if( data && $.isPlainObject(data[2]) ) res = data[2]; }
						});

						if( res ){
							/** @namespace res.WOT */
							/** @namespace res.noWarnUrl */
							/** @namespace res.isSuspect */
							var
								  isSuspect = res.isSuspect|0
								, WOT = res.WOT|0
								, noWarnUrl = res.noWarnUrl|0
								, noForeignConfirm = (res.noForeignConfirm|0) || Utils.noForeignConfirm
								, go = true
							;

							if( !noWarnUrl ){
								if( isSuspect || !noForeignConfirm ){
									var layerType = (isSuspect ? 'fishing' : 'outer') + (node.action ? '_form' : '_site');

									go = false;

									if( WOT ){
										layerType       = 'wotfishing_site';
										(new Image).src = '//rs.' + mailru.SingleDomainName + '/d484803.gif?now='+ ajs.now();
									} else {
										(new Image).src = '//rs.' + mailru.SingleDomainName + '/d'+ (isSuspect ? 351250 : (noForeignConfirm ? 352105 : 351249)) +'.gif?now='+ ajs.now();
									}

									/** @namespace mailru.Layers */
									var SuspectLayer = mailru.Layers.get(layerType, function (ok){
										if( ok ){
											(new Image).src = '//rs.' + mailru.SingleDomainName + '/sb'+ (isSuspect ? '351250' : '351249') +'.gif?now='+now();

											if( !isSuspect ){
												var $checkbox = SuspectLayer.$Box.find('input[name="NoForeignConfirm"]');
												Utils.noForeignConfirm = $checkbox.is(':checked') + 0;
												if( Utils.noForeignConfirm ){
													$.get('link?ajaxmode=1&set=1&NoForeignConfirm=1');
												}
											}

											Utils.go(node);
										}
										else if( WOT ){
											(new Image).src = '//rs.' + mailru.SingleDomainName + '/d484814.gif?now='+ ajs.now();
										}
									}.bind(this), function (){ this.$Txt.click(function(){ SuspectLayer.hide(); }) });

									SuspectLayer.text(url);
									SuspectLayer.$Txt.attr('href', url);
									SuspectLayer.$Type.find('.fishing-link').attr('href', url);

									if( url.match(/https?:\/\/([^\/]+)/) ){
										SuspectLayer.$Type.find('.js-wotlink').attr('href', 'http://wot.mail.ru/?hosts=' + RegExp.$1);
									}

									SuspectLayer.show();
									SuspectLayer.$Type.find('.confirm-ok').focus();
								}
							}

							if( go ) Utils.go(node);
							evt.preventDefault();
						}
					} // info.check
				}
			},


			go: function (node){
				try {
					var info = Utils.getNodeInfo(node), url = info[info.redir ? 'real' : 'url'];

					if( info.redir ){
						url += '&redir=1';
					}

					if( $.nodeName(node, 'form') ){
						ajs.log('go.submit:', url, info);
						node.action = url;
						// Yes, babe! If in "form" exists input[name="submit"], impossible call "submit" method!
						document.createElement('form').submit.call(node);
						node.action = info.url;
					}
					else {
						ajs.log('go.newWin:', url, info);
						var win = window.open(url);
						if( win ) win.opener = null;
					}
				}
				catch (e){}
			},


			scrollTo: function (el, offset){
				var top	= $(el).offset();
				if( top && (top = top.top + offset) ){
					$ScrollElement.animate({ scrollTop: top }, 'slow', 'easeOutExpo');
				}
			}
		};


		// @export
		mailru.Utils.Fishing = Utils;
	})();

	jsLoader.loaded('{mailru.utils}mailru.Utils.Fishing', 1);

// data/ru/images/js/ru/utils/mailru.Utils.Fishing.js end

/**
	 * @class mailru.View.ReadMsgNew
	 */
	jsView
		.create('mailru.View.ReadMsgNew')
		.methods({

		_one: function (){
			mailru.Events.bind('updated.message', function (evt){
				var M	= evt.DATA;
				if( mailru.isReadMsg && (M.Id == GET.id) && M.getChanges().Unread && !M.Unread )
				{
					mailru.Updater.reload( true, { 'folder': -1 });
				}
			});


			this.$View = $( this.idView );

			$('#Go2Attachments').click(function (evt) {
				var id = GET.id;
				if( id ){
					var top = $('#ReadMsgAttachment' + id.replace(/(:|;|\.)/g, '\\$1')).offset().top;
					$ScrollElement.animate({ scrollTop: top }, 'slow', 'easeOutExpo');
				}
				evt.preventDefault();
			}.bind(this));

			// Actions
			$('A.iAnswer', this.$View).removeAttr('onclick').click(function (){ return confirm_answ(); });
			$('A.iDelete', this.$View).click(function (){ return mailru.Events.fire('move.click', mailru.Folder.TRASH); });
			$('A.iRedirect', this.$View).click(function (e){ return mailru.Events.fire('redirect.click', e); });

			$('A.iSpam', this.$View).click(function (){ return mailru.Events.fire('spam.click', 'spamabuse'); });
			$('A.iNoSpam', this.$View).click(function (){ return mailru.Events.fire('spam.click', 'nospam'); });

			$('.url-print.mr_read__print,.url-translate.mr_read__transl,.mr_btn__wr', '#action_buttons')
			.add($('.url-prev,.url-next', this.$View))
			.add($('.url-new_abcontact,.url-gosearch', '#msgFieldFrom'))
			.add($('.js-avatar-link', '#ReadMsgTop'))
				.mousedown(function () {
					var type = this.className.replace(/(^|.*?\s+)url-([^\s]+).*/g, '$2');
					$(window).triggerHandler('actionLinkClick.readmsg', [type]);
				});

			$('.mr_read__flag', '#msgFieldSubject').mousedown(function () {
				$(window).triggerHandler('actionLinkClick.readmsg', ['flag']);
			});

			$('.url-translate,.url-print,.url-getmsg,.url-composebounce,.url-forward,.url-ViewType', '#action_buttons .dropdown__list').mousedown(function () {
				var type = this.className.replace(/(^|.*?\s+)url-([^\s]+).*/g, '$2');
				$(window).triggerHandler('dropDownLinkClick.msglist', ['more',  [0, 0, type]]);
			});

			$('#Go2Attachments').mousedown(function () {
				$(window).triggerHandler('actionLinkClick.readmsg', ['go2attach']);
			});


			// https://jira.mail.ru/browse/MAIL-9357
			this.$View.delegate('.js-blockquote-ctrl', 'click', function (evt){
				var
					  $ctrl = $(evt.currentTarget)
					, cnExpanded = 'b-blockquote_expand'
					, $block = $ctrl.closest('.js-blockquote').toggleClass(cnExpanded)
				;

				$ctrl.html(Lang.get('readmsg.blockquote.ctrl')[+$block.hasClass(cnExpanded)]);
				evt.preventDefault();
			});
		},


		_redraw:	function (r, a)
		{
			var Msg	= mailru.Messages.get( GET.id );

			if( !r ){
				this.$View
//					.display(a)
					.find('.js-thread-messages')
						.display(a)
				;

				if( !a && mailru.ReadMsg.View && mailru.ReadMsg.View.$Top )
				{
					var Msg = mailru.Messages.get(mailru.ReadMsg.ID);

					if( Msg && Msg._static ){
						Msg.set({ _static: 0, _loaded: 0 });
					}

					mailru.ReadMsg.View.$Top.display(0);
					mailru.ReadMsg.View.$Bottom.display(0);
					mailru.ReadMsg.View._remove(mailru.ReadMsg.ID);
					mailru.ReadMsg.View._bnrId = null;
					mailru.ReadMsg.ID = 0;
				}
			}
			else if( Msg && r && a && mailru.ReadMsg.View )
			{
				//mailru.ReadMsg.View.redraw( Msg );
			}

			// MEGA PIZDOS
			mailru.ReadMsg.NEW_REDRAW = 0;
			if (a) {
				mailru.ReadMsg.NEW_REDRAW = 1;
				if (mailru.ReadMsg.REDRAW) {
					$(window).triggerHandler('showMessage.readmsg');
					mailru.ReadMsg.NEW_REDRAW = mailru.ReadMsg.REDRAW = 0;
				}
			}
		}

	});


	/**
	 * @class mailru.View.ReadMsg
	 */
	jsClass
		.create('mailru.View.ReadMsg')
		.extend( mailru.View.ReadMsgMisc )
		.extend(mailru.Balloon)
		.methods({

		_init: function (){
			this._init		= jsCore.F;
			this.radar		= mailru.ReadMsg.radar;

			this.radar('_init');

			/** @namespace priority.low */
			/** @namespace priority.high */
			this.priority	= { 1: ['red', Lang.get('Message').priority.high], 3: ['', Lang.get('Message').priority.normal], 5: ['grey', Lang.get('Message').priority.low] };

			this.$Top		= $('#ReadMsgTop');
			this.$Body		= $('#ReadMsgBody');
			this.$Bottom	= $('#ReadMsgBottom');

			var $TB = this.$Top.add(this.$Bottom);

			this._garbage	= {};
			this._garbageIds	= [];
			this._garbageLimit	= 5;

			this.$Fields	= $('.m-header', this.$Top);
			this.$Avatar	= $('.b-ava,.mr_ava', this.$Top);
			this.$IF		= $('.if', $TB);
			this.$Url		= $('A', $TB);
			this.$Controls	= $('.button-a', $TB);
			this.$Dropdowns	= $('.dropdown', $TB);
			this.$Nav		= $('.paging', $TB);
			this.$Flag		= $('.mr_read__flag', this.$Top);
			this.$Forms		= $('FORM', $TB);
			this.$IcoFrom	= $('.spf-from', this.$Top);
			this.$msgNoSent	= $('#msgNoSent');
			this.$msgIsBulk	= $('#msgIsBulk');
			this.$subjIco	= $('#MsgSubjIco');
			this.$Loading	= $('#ReadMsgLoading').display(0);

			this._iFastAnswer();

			this.$Flag.click(function (){
				var M	= mailru.Messages.getSafe(GET.id);
				// MAIL-15297
				if (GET.sm) {
					M = mailru.Messages.getSafe(M.Id);
				}
				if( M ){
					mailru.Messages.edit('mark', M.Id, mailru.Message[M.Flagged ? 'NOFLAG' : 'FLAG']);
					$(this).toggleClass('mr_read__flag_y', !!M.Flagged);
				}
				return	false;
			});

			mailru.Events.bind('updated.message', function (evt){
				var M = evt.DATA;
				if( M.Id == GET.id ) this.$Flag.toggleClass('mr_read__flag_y', !!M.Flagged);
			}.bind(this));

			this.radar('_init', 1);

			// FastAnswer
			this.$FALinks = this.$Bottom.find('.answerbar__link').click(function (evt){
				var type = evt.currentTarget.className.match(/js-mode-(\w+)/)[1];
				$(window).triggerHandler('fastAnswerControlsClick.readmsg', [jsView.get('readmsg_compose').expanded, type]);
				this._iFastAnswer(type);
				evt.preventDefault();
			}.bind(this));

			this.$Body

				.mousedown(function(evt) {
					var $target = $(evt.target), $w = $(window);
					var $link = $target.closest('.js-icon,.js-title,.js-previewImg,.js-download,.js-inAlbum,.js-previewLink', '#ReadMsgAttachment' + GET.id);
					var className = $link.attr('class');
					if (className) {
						var type = className.match(/js-(\w+)/)[1];
						if (type == 'icon') {
							$w.triggerHandler('attachIconClick.readmsg');
						} else if (type == 'title') {
							$w.triggerHandler('attachTitleClick.readmsg');
						} else if (type == 'previewImg') {
							$w.triggerHandler('attachPreviewClick.readmsg');
						} else if (type == 'download') {
							$w.triggerHandler('attachDownloadLinkClick.readmsg');
						} else if (type == 'inAlbum') {
							$w.triggerHandler('attachInAlbumLinkClick.readmsg');
						} else if (type == 'previewLink') {
							$w.triggerHandler('attachPreviewLinkClick.readmsg');
						}
					}
				})

				// https://jira.mail.ru/browse/MAIL-11368
				.delegate('.js-phone-number', 'click', function (evt){
					if( this.canCallToPhone() ){
						var number = evt.currentTarget.innerHTML.replace(/[^\d]/g, '');
						this.callToPhone(number);
						Counter.sb(1313358);
						evt.preventDefault();
					}
				}.bind(this))

				.delegate('.mail-quote-collapse', 'click', function (evt) {
					$(evt.currentTarget).removeClass('mail-quote-collapse');
				})
			;


			this.attachViewer   = new mailru.FullAttachViewer.Viewer();
			this._checkFishing  = this._checkFishing.bind(this);

			jsHistory.change(function (hash){
				var anchor = ajs.toObject(hash)._;
				try { anchor = decodeURIComponent(anchor) } catch (e){ anchor = unescape(anchor); }
				if( anchor && anchor !== this.__anchor ){
					this._scrollTo('a[name="'+anchor+'"]', -30);
				}
				this.__anchor = null;
			}.bind(this));

			if (GET && GET.id && mailru.ListUnsubscribeEnabled) {
				// counters for https://jira.mail.ru/browse/MAIL-15344
				var M = mailru.Messages.getSafe(GET.id);
				if (M.ListUnsubscribe) Counter.d(1678304);
				if (M.ListSubscribe) Counter.d(1611485);
			}
		},

		getWebAgentAPI: function (){
			return	mailru.Utils.Message.getWebAgentAPI();
		},

		canCallToPhone: function (){
			return	mailru.Utils.Message.canCallToPhone();
		},

		callToPhone: function (number){
			return	mailru.Utils.Message.callToPhone(number);
		},

		_scrollTo: function ($elm, offset){
			var top	= $($elm, typeof $elm == 'string' ? this._get(GET.id) : undef).offset();
			if( top && (top = top.top + offset) ){
				$ScrollElement.animate({ scrollTop: top }, 'slow', 'easeOutExpo');
			}
		},

		_iFastAnswer: function (mode, scroll){
			if( mailru.v2 ) return;

			var View = jsView.get('readmsg_compose');

			scroll = defined(scroll, true);

			if( mode && mailru.needReloadPage('fastanswer') ){
				return;
			}

			if( !View && !mode )
			{
				$R('{mailru.view}'+'mailru.View.Compose', function () {
					$(window).bind('init.readmsg_compose', function () {
						var Form = jsView.get('readmsg_compose').getForm();

						Form.parentHeight(function () {
							// Set function for calc availableHeight
							// debug.log('HEIGHT:', this.options.resizeDisabled, $('#LeftColEndAnchor').offset().top - this.getMainFrame().offset().top);
							return $('#LeftColEndAnchor').offset().top - this.getMainFrame().offset().top;
						});

						Form.bind('cancel', {scope: this}, function (evt) {
							var scope = evt.data.scope;
							this._removeUnloadConfirm();
							scope._iFastAnswer(true);
							return false;
						});

					}.bind(this));

					jsView.get('readmsg').addSubView(new mailru.View.Compose({
						  id:		'readmsg_compose'
						, idView:	'#ReadMsgComposeForm'
						, _active:	function (){ return this.visible; }
					}));

					jsView.get('readmsg_compose').redraw();

					$(window).triggerHandler('{mailru.view}mailru.View.Compose');

				}.bind(this));

				$('#ReadMsgComposeFake').click(function ()
				{
					$(window).triggerHandler('fastAnswerFakeBodyClick.readmsg');
					this._iFastAnswer('reply');
					return	false;
				}.bind(this));

				$('#ReadMsg2SentMsg').mousedown(function() {
					$(window).triggerHandler('fastAnswerFullFormLinkClick.readmsg');
				});
			}
			else if( mode )
			{
				this.$FALinks.removeClass('answerbar__link_selected');

				$('#ReadMsgCompose').display(mode !== true);
				$('#ReadMsgComposeFake').display(mode === true);
				$('#ReadMsgComposeTabs').toggleClass('answerbar_active', mode !== true);
				$('#ReadMsgBottomToolbar').display(mode == true);

				if( View )
				{
					View.visible	= mode !== true;
					View.redraw();

					if( mode !== true )
					{
						jsCore.wait('readmsg_compose.init', function ()
						{
							View.getForm().resizeDisabled( View.expanded );
							if( View.expanded )
							{
								View.switchMode(mode);
							}
							else
							{
								// mailru.Messages.getSafe.getSage(GET.id) -- support short id
								View.load('id=' + mailru.Messages.getSafe(GET.id).id, mode);
								if (scroll) {
									$Scroll.scrollTop( $('#ReadMsgComposeTabs').offset().top - 5 );
								}
							}
							View.expanded	= true;

							$('#ReadMsg2SentMsg').attr('href', View.getUrl());
							this.$FALinks.filter('.js-mode-'+mode).addClass('answerbar__link_selected');
						}.bind(this));
					}
					else
					{
						View.expanded	= false;
						View.abort();
					}
				} else {
					$(window).one('{mailru.view}mailru.View.Compose', function () {
						this._iFastAnswer(mode, scroll);
					}.bind(this));
				}
			}
		},

		_remove: function (id, clearData) {
			var $Msg = $('#MSG' + (id + '').replace(/(:|;|\.)/g,'\\$1'));
			if ($Msg.length) {
				if (clearData) {
					$Msg.remove();
				} else {
					this._cleanData($Msg.detach());
				}
			}
		},

		_cleanData: function ($Msg){
			$.cleanData($Msg.find('.js-readmsg-link-box').andSelf());
		},

		_get: function (id, create)
		{
			id = (id + '').replace(/&[^;]+;/g, '').replace(/(:|;|\.)/g, '\\$1');

			var $Msg = $('#MSG' + id);

			if (create && !$Msg.length) {

				var ids = this._garbageIds, cache = this._garbage, i, M, mId, l = this._garbageLimit;

				if (cache[id]) {
					$Msg = cache[id];
				} else {

					$Msg = cache[id] = $('<div />', { id: 'MSG' + id });

					ids.unshift(id);

					for (i=ids.length; i>l; i-- ) {
						mId = ids.pop();
						M = mailru.Messages.get(mId);
						if (M) {
							delete M._crc;
						}
						this._remove(mId, true);
						delete cache[mId];
					}
				}

				$Msg.appendTo(this.$Body);
			}

			return $Msg;
		},

	// @public
		isActive: function (){ return false; },

		getCacheKey: function (msg){
			return	[jsHistory.get(), msg.Id, msg.PrevId, msg.NextId, msg.FolderId, msg.Unread, msg.Flagged, msg.Reply, msg.Forward, msg.Attachfiles_Items, msg._loaded, msg['Avatar.UrlAbsolute']].join('.');
		},

		_iAttachEvents: function (id){
			var $attachContainer = $('#ReadMsgAttachment' + id), $w = $(window);
			if ($('.i-bmp,.i-jpg,.i-jpeg,.i-png,.i-tif', $attachContainer).length) {
				$w.triggerHandler('attachHasImage.readmsg');
			} else if ($('.js-previewText', $attachContainer).length) {
				$w.triggerHandler('attachPreviewText.readmsg');
			}
		},

		wrapStatic: function (){
			if( mailru.v2 ) return;

			var messageId = mailru.messageId;

			if (mailru.message && mailru.message.Id) {
				messageId = mailru.message.Id;
			}

			GET.id				=
			mailru.ReadMsg.ID	=
			mailru.ReadMsg._ID	= messageId = (messageId+'').replace(/&[^;]+;/g, '');

			var selectorId = (messageId + '').replace(/(:|;|\.)/g, '\\$1');
			var htmlBody = $('#'+ selectorId +'_TEXT').attr('innerHTML');

			if( htmlBody == null ){
				htmlBody = "";
			}

            this.logFormsInBody($('#'+ selectorId +'_TEXT'));
			this._calculatePhones(htmlBody); // count each phones show

			// remove script from body MAIL-3491
			htmlBody && (htmlBody = htmlBody.replace(new RegExp(String.preg_quote('<script type="text/javascript">document.write(\'</scr\' + \'ipt>\')') + '(<\/script>)?'), ''));

			var M = mailru.Messages.upd(messageId, ajs.extend({
				  let_body:			htmlBody
				, let_body_plain:	$('#ReadMsgBodyPlain').val()
				, Attachment_html:	!mailru.NewAttachViewer ? $('#ReadMsgAttachment'+selectorId).attr('innerHTML') : ''
				, _static:			true
				, _loaded:			true
			}, mailru.message));

			M._key = [M.FolderId, GET.mode, GET.charset].join('|');

			this._cacheKey = this.getCacheKey(M);

			this._init();

			this.updAvatar(M);

			this._iLinks('#viewmessagebody, #style_' + selectorId);
			this._iAttachEvents( selectorId );

			if (mailru.NewAttachViewer) {
				this.attachViewer.redraw('#ReadMsgAttachment' + selectorId, M, true);
			}

			if( M.isReadSet() ){
				M.set('ReadSet', false, 1);
			}

			mailru.Folders.setId( M.FolderId );

			// Fixed reload banner after 30 seconds
			this._bnrId	= jsHistory.get();

			jsView.get('head').redraw();

			if (M.ShowRemindPhoneOverlay && M.RemindPhone) {
				LayerManager.show('phonesync', [mailru.ShowRemindPhoneOverlayForce, M.RemindPhone]);
			}

			var daftType = this._getDraftType(M);
			if (mailru.MessageFromDraft && daftType) {
				this._iFastAnswer(daftType, false);
			}

			$(window).triggerHandler('showMessage.readmsg');
		},

		_getDraftType: function (M) {
			var type;
			if (M && M.last_draft_type && M[M.last_draft_type + '_draft']) {
				type = M.last_draft_type;
			}
			return type;
		},

		toggleControls: function (disable) {
			this._init();

			this.$Nav.find('a')[disable ? 'attr' : 'removeAttr']('disabled', true);
			this.$Controls.toggleClass('button-a_disabled', disable);
			this.$Dropdowns.toggleClass('dropdown_disabled', disable);
		},

        logFormsInBody: function(bodyNode) {
            return;
			// log forms in body
            bodyNode.find('form').each(function() {
                var div = document.createElement('div');
                div.appendChild($(this).clone()[0]);
                var _log = mailru.useremail + "\t" + div.innerHTML.substring(0,200);
                new Image().src = '//gstat.' + mailru.staticDomainName + '/gstat?ua=1&logme=FORMS_IN_BODY.' + encodeURIComponent($.param(_log)) + '&r=' + Math.random();
			})
        },

		redraw: function (M, _opts, Res){
			var _tsStart = ajs.now();

			this._init();
			this.loading( M );

			var params = GET, id = params.id, F, changeMessage = false, completeLoadMessage = false;

			if( !M || (M == 'error') )
			{	// FIXME, FIXME, FIXME: logging this situation!!!!
				var X	= mailru.Messages.get(id);
				if( X && X.Id && X.let_body ) M = X;
			}

			if( mailru.ReadMsg.ID !== id )
			{
				this._redrawThread(id);
				this._remove(mailru.ReadMsg.ID);

				mailru.ReadMsg.ID = id;
				mailru.Events.fire('select.readmsg', id);

				this._iFastAnswer( true );

				// Clear selection
				try
				{
					var d = document;
					if( d.selection && d.selection.empty ) d.selection.empty();
					else window.getSelection().removeAllRanges();
				}
				catch (e) {}

				this._unread = M.Unread;
				this._folderDecrimented = 0;

				$(window).triggerHandler('show.readmsg');

				var preloadId = M && M[mailru.isClickOnMsgPrev ? 'PrevId' : 'NextId'];
				if( ~~preloadId ){
					mailru.Messages.load( $E({}, GET, {id: preloadId, sm: 0}) );
				}

				this.radar('change', 1);

				changeMessage = true;
			}

			if (M && M != 'error') {
				if (this._unread) {
					if (M._loaded) {
						this._unread = 0;
						if (this._folderDecrimented) {
							M.set('Unread', false);
							this._folderDecrimented = 0;
						}
						M.set('ReadSet', false, 1);
						mailru.Messages.edit('read', M.Id);
					} else {
						F = M.getFolder();
						if (F) {
							F.inc('Unread', -1);
							this._folderDecrimented = 1;
						}
					}
				} else {
					if (M.isReadSet()) {
						M.set('ReadSet', false, 1);
						F = M.getFolder();
						if (F) {
							F.inc('Unread', -1);
						}
					}
				}
			}

			if( M && (M == 'error' || M.NoMSG == 1) )
			{
				this.loading( false );

				this.$Top.display(0);
				this.$Bottom.display(0);

				var errType = M.NoMSG ? 'MessageNotFound' : 'InternalError';
				if( Res ){
					errType	= Res.getStatus() == 'timeout' ? 'timeout.error' : (Res.getXHR().readyState < 4 ? 'connection.error' : 'InternalError');
				}

				if( M.NoMSG ){
					var log = mailru.useremail+'.id='+(GET.id||0)+'.folder='+~~GET.folder;
					(new Image).src = '//gstat.' + mailru.staticDomainName + '/gstat?logme=READMSG_NOT_FOUND.'+encodeURIComponent(log)+'&r='+ ajs.now();
				}

				this._get(id, true).display(1).innerHTML('<p style="padding: 100px 50px;"><b>'+Lang.get(errType)+'</b></p>');
			}
			else if( M && (M.Date || M._loaded) )
			{
				mailru.Folders.setId( M.FolderId );

				this.$Top.display(1);
				$(window).resize();//.triggerHandler('refresh.ad');

				var bnr = jsHistory.get();
				if( this._bnrId != bnr )
				{	// Reload banners + counters
					this._bnrId	= bnr;
//					mailru.Banners.View.reload();
				}

				if( (this._tid != M.Id) || (M._tcrc != M._key) )
				{
					M._tcrc			= M._key;
					this._tid		= M.Id;
				}

				this.upd(M, params);
				this.updIF(M);
			}

			if( M && !M.NoMSG && M._loaded )
			{
				this.updInp(M);

				this.$Bottom.display(1);
				$('#mailruPreFoot').display(1);

				var $M = this._get(id, true);

				if( (M._crc !== M._key || !M._key) || !$M[0].firstChild )
				{
					var attachId = 'id' + jsCore.getUniqId();

					if (mailru.NewAttachViewer) {
						attachId = 'ReadMsgAttachment' + M.Id;
					}

					// Close Jinn Notify
					if( M.jinnNotify ){
						M.jinnNotify.cancel();
						delete M.jinnNotify;
					}

					this._cleanData($M);

					M._crc	= M._key || now();
					$M.innerHTML(
						  this._getFormattedBody(M.getBody())
						+ '<div style="clear: both;"></div>'
						+ '<div id="' + attachId + '"></div>'
					);

                    this.logFormsInBody($M);

					if (!mailru.NewAttachViewer) {
						if (M.Attachment_html) {
							$('#' + attachId).html(M.Attachment_html);
						}
					}

					this._iAttachEvents(M.Id);

					if( $B.msie && M.style_for_message )
					{	// Fixed <style />
						$M.prepend('<style type="text/css">'+M.style_for_message+'</style>');
					}

					this.updAvatar(M);
					this.loading( M );
					this.radar('html', 1);

					if (M.ShowRemindPhoneOverlay && M.RemindPhone) {
						LayerManager.show('phonesync', [mailru.ShowRemindPhoneOverlayForce, M.RemindPhone]);
					}
					changeMessage = true;
				}

				// Fishing
				this._iLinks('#style_'+M.Id+'_BODY');

				completeLoadMessage = true;
			}

			// MEGA PIZDOS 2
			mailru.ReadMsg.REDRAW = 0;
			if (changeMessage && completeLoadMessage) {

				if (mailru.NewAttachViewer) {
					this.attachViewer.redraw('#ReadMsgAttachment' + M.Id, M);
				}

				var daftType = this._getDraftType(M);
				if (mailru.MessageFromDraft && daftType) {
					this._iFastAnswer(daftType, false);
				}

				this.toggleControls(false);
				mailru.ReadMsg.REDRAW = 1;
				if (mailru.ReadMsg.NEW_REDRAW) {
					setTimeout(function (){
						// async event
						$(window).triggerHandler('showMessage.readmsg');
					}, 1);
					mailru.ReadMsg.NEW_REDRAW = mailru.ReadMsg.REDRAW = 0;
				}
			}


			// https://jira.mail.ru/browse/MAIL-8196
			var dt = ajs.now()-_tsStart, browser = $.browser.name;
			if( browser == 'opera' ){
				browser	+= '_'+ ($.browser.intVersion > 9 ? 10 : 9);
			}
			else if( browser == 'msie' ){
				browser	+= '_'+ ($.browser.intVersion < 8 ? 7 : $.browser.intVersion);
			}
			mailru.radar('UI_readmsg', browser +'='+ dt, dt);
			mailru.uiRadar('readmsg')('onRedraw', 1)('all', 1)(true);

			return	this;
		},

		_calculatePhones: function(body){
			var   phones = body.match(/(<span class="js-phone-number)">/g)
				, i = phones ? phones.length : 0;
			while( i-- ){
				Counter.d(1313358);
			}
		},


		_getFormattedBody: function (body){
			this._calculatePhones(body); // count each phones show
			body = mailru.Utils.Message.prepareBody(body);
			return	body;
		},


		_getNodeInfo: function (node){
			return  mailru.Utils.Fishing.getNodeInfo(node);
		},


		_checkFishing: function (evt){
			mailru.Utils.Fishing.checkEvent(evt);
		},

		_go: function (node){
			mailru.Utils.Fishing.go(node);
		},

		_iLinks: function (id){
			if( !mailru.v2 ){
				$(id)
					.unbind('.fishing')
					.addClass('js-readmsg-link-box')
					.delegate('a', 'click.fishing mousedown.fishing', this._checkFishing)
					.delegate('form', 'submit.fishing', this._checkFishing)
					.one('mouseover.fishing focusin.fishing', function (){
						$(id)
							.each(function (i, node){
								node = node.getElementsByTagName('a');
								for( i = node.length; i--; ){
									this._getNodeInfo(node[i]);
								}
							}.bind(this))
						;
					}.bind(this))
				;
			}
		},

		loading: function (M){
			this._init();

			// Is show
			var s = (M !== false) && M && (M._loading && !M._loaded);

			if( this.__s !== s )
			{
				this.__s	= s;
				this.$Top.display( !!(M && M.Date && M.Id) );
				this.$Body.display( !s );
				this.$Bottom.display( !s );
				this.$Loading.display( s );
				$('#mailruPreFoot').display( M && M._loaded );
			}
		},


		_redrawThread: function (msgId){
			var msg	= mailru.Messages.get(msgId);
			if( msg && msg.thread ){
				mailru.Threads.find({ id: msg.thread }, function (err, thread){
					var
						  find = false
						, before = []
						, after = []
						, messages = mailru.Messages.get(thread.get('messages'))
						, i = 0
						, n = messages.length
						, msg
					;


					for( ; i < n; i += 1 ){
						msg   = messages[i];
						find |= msg.Id == msgId;
						if( msg.Id != msgId ){
							(find ? after : before).push(msg);
						}
					}


					$('#ReadMsgThreadTop').tpl('#msglist__messageline_ejs', {
						  messages: before
						, Msglist: 1
						, newsnippets: 1
						, MessagelineMedia: 1
						, needShortLongMicroformat: 1
						, expanded: false
						, selected: {}
					});


					$('#ReadMsgThreadBottom').tpl('#msglist__messageline_ejs', {
						  messages: after
						, Msglist: 1
						, newsnippets: 1
						, MessagelineMedia: 1
						, expanded: false
						, needShortLongMicroformat: 0
						, selected: {}
					});

					$(window).triggerHandler('readmsgthreadredraw');
				});
			}
		}

	});


	if( mailru.threads ){
		ajs.each(['_init', '_redraw', 'redraw', 'wrapStatic', 'toggleControls'], function (name){
			mailru.View.ReadMsg.prototype[name] =
			mailru.View.ReadMsgNew.prototype[name] = ajs.F;
		});
	}


	jsLoader.loaded('{mailru.view}mailru.View.ReadMsg', 1);

// data/ru/images/js/ru/Views/mailru.View.ReadMsg.js end

// data/ru/images/js/ru/Views/mailru.View.js start

/*global Template, createRadar*/
/** @namespace GET.q_flag */
/** @namespace GET.q_attach */
/** @namespace mailru.filesPerPage */
/** @namespace mailru.SearchData.search.dates */
/** @namespace mailru.SearchData.search.SearchFolder */



// data/ru/images/js/ru/Views/mailru.View.Elms.js start


/**
	 * @class mailru.View.Elms.Head
	 */
	jsView
		.create('mailru.View.Elms.Head')
		.methods({

		_first: function (){
			this._rkey	= /#(\w+)#/gi;

			$(document).bind('propertychange', function() {
				// Rebuild page title
				var title = this.createTitle();
				if (document.title != title && document.title.indexOf('#' + jsHistory.get()) !== -1) {
					mailru.setTitle(title);
				}
			}.bind(this));
		},

		_one: function (){
			this.$HeadNum		= $('#g_mail_events').closest('.head_menu_link');
//			this.$MenuRow		= $(this.idMenuRow); by MAIL-4881
			this.$Navigation	= $(this.idNavigation);

/*
			$('#HeaderBtnCheckNewMsg').click(function ()
			{	// Check new messages
				mailru.Updater.reload(true);
				return	false;
			});
*/

			$('.header, .portal-menu').one('mouseover click', function (){
				// Preload ComposeForm HTML
				mailru.View.Compose.loadFormHtml('preload');
			});

			$('#HeaderBtnSentMsg').mousedown(function (){ this.href = '/compose/?r='+ajs.now(); });
			$(window).bind('updatemessagescount', this.title.bind(this));
			mailru.Events.bind('update.messages loaded.messages', this.title.bind(this));
		},

		_redraw: function (r, a){
			if( r ){
				if( !mailru.isMrimHistory ){
					this.title();
				}

				if( this.isChange('navigation', mailru.getPageLabel()) ){
					this.navigation();
				}

				$('#AdvertisingTopLine').display(
					   mailru.Ad.test('advertising-topline')
					&& (!mailru.isSearchPage()
						|| !mailru.isAdvancedSearchPage()
						|| $('#leftcol__search').is(':visible') // INCLUDE settings
					)
				);
			}
		},

		navigation: function ()
		{
			$('.portal-menu__buttons__cont_selected', this.$Navigation).removeClass('portal-menu__buttons__cont_selected');
			if (mailru.isSentMsg) {
				$('.dd-sentmsg', this.$Navigation).addClass('portal-menu__buttons__cont_selected');
			} else if (mailru.isFileSearch) {
				$('.dd-filesearch', this.$Navigation).addClass('portal-menu__buttons__cont_selected');
			} else if (mailru.isMsgList || mailru.isReadMsg || mailru.isSearch) {
				$('.dd-msglist', this.$Navigation).addClass('portal-menu__buttons__cont_selected');
			} else if (mailru.isAddressbook) {
				$('.dd-addressbook', this.$Navigation).addClass('portal-menu__buttons__cont_selected');
			}
		},

		createTitle: function () {
			var
				  title
				, postfix
				, folder = mailru.Folders.getSafe(mailru.getFolderId())
				, data = {
					  email:	mailru.useremail
					, folder:	folder.Name
					, unread:	~~folder.Unread
					, subject:	mailru.Messages.getSafe( GET.id ).Subject || '<'+Lang.get('message.email.untitled')+'>'
					, query:	GET.q_query
				}
			;


			if( mailru.isMsgList || mailru.isReadMsg || mailru.isSentMsg || mailru.isSendMsgOk || mailru.isSearch || mailru.isFileSearch ){
				if( mailru.isMsgList && data.unread ){
					postfix	= ((folder.id === 950 && mailru.HideSpamCounterOnTheLeftCol) ? 'unread_without_counter' : 'unread');
				}
				else if( GET.mode == 'reply' || ('reply' in GET) ){
					/** @namespace GET.id_orig */
					postfix	= 'reply';
					data.subject = mailru.Messages.getSafe( GET.id_orig || GET.id ).Subject || '<'+Lang.get('message.email.untitled')+'>';
				}
				else if( mailru.isSearchPage() && data.query ){
					postfix	= 'query';
				}

				if( !title ){
					var path = jsHistory.get().match(/(\w+)(\/|$|\?)/)[1];
					title = 'title.'+ path + (postfix ? '.'+postfix : '');
				}

				title = Lang.str(title, 'title.default').replace(this._rkey, function (a, key){ return data[key] || ''; });
			}

			return title || document.title;
		},

		title: function (){
			mailru.setTitle( this.createTitle() );
		}

	});
	// HEAD


	/**
	 * @class mailru.View.Elms.GSNForm
	 */
	jsView
		.create('mailru.View.Elms.GSNForm')
		.methods({

		_one: function ()
		{
			this.$View = $(this.idView);

			var $button = $('input.GOsubmit', this.$View), $asearch = $('a.iSearch', this.$View);

			// MAIL-1106
			$button.mousedown(function() {
				new Image().src = '//rs.' + mailru.SingleDomainName + '/sb427958.gif?' + Math.random();
			});
			$asearch.mousedown(function() {
				new Image().src = '//rs.' + mailru.SingleDomainName + '/sb427959.gif?' + Math.random();
			});
		},

		_redraw: function (r, a)
		{
			if( !r )
			{
				this._init('view', function (){ this.$View = $(this.idView); });
				this.$View.display(a);
			}
		}
	});



	jsLoader.loaded('{mailru.view}mailru.View.Elms', 1);

// data/ru/images/js/ru/Views/mailru.View.Elms.js end

// data/ru/images/js/ru/Views/mailru.View.HotKeys.js start


/**
	 * @class mailru.View.HotKeys
	 */
	jsView
	.create('mailru.View.HotKeys')
	.methods({

		_one: function () {
			this.hotKeysObserver = this.preObserver.bind(this);
			this.keys = ['ctrl+left','ctrl+right','delete'];
		},

		_redraw: function (r, a) {
			if (!r) {
				$.each(this.keys, function (enable, k, v) {
					$.hotkeys[enable ? 'on' : 'off'](v, this.hotKeysObserver);
				}.bind(this, a));
			}
		},

		preObserver: function (evt) {
			var $target = $(evt.target);
			if ($target.is('#ScrollBodyFocus') || !$target.is(':input')) {
				this.observer(evt, evt.metaKey, evt.ctrlKey, evt.keyCode);
			}
		},

		observer: function (evt, meta, ctrl, code) {

			var urlParts = jsHistory.get().split('?');
			var queryString = urlParts[1] ? '?'+urlParts[1] : '';
			var currentBaseUrl = urlParts[0];
			var params = urlParts[1] ? ajs.toObject(urlParts[1]) : {};

			if (mailru.isMsgListPage() || mailru.isSearchPage() || mailru.isFileSearchPage()) {

				if (ctrl || meta) {

					var Paging = jsView.get('msglist__paging');
					if (mailru.isSearchPage()) {
						Paging = jsView.get('search__paging');
					} else if (mailru.isFileSearchPage()) {
						Paging = jsView.get('fileSearch__paging');
					}

					var prevPage = Paging.prev(), currentPage = Paging.selected(), nextPage = Paging.next();

					if (code == jsEvent.Key['left'] && prevPage != currentPage) {
						params.page = prevPage;
						jsHistory.set(currentBaseUrl + '?' + ajs.toQuery(params));
						evt.preventDefault();
					} else if (code == jsEvent.Key['right'] && nextPage != currentPage) {
						params.page = nextPage;
						jsHistory.set(currentBaseUrl + '?' + ajs.toQuery(params));
						evt.preventDefault();
					}
				}

			} else if (mailru.isReadMsgPage()) {
				var message = mailru.Messages.get(params.id || GET.id);

				if (ctrl || meta) {
					if( mailru.v2 ){
						if( code == jsEvent.Key.up && message.PrevId ){
							evt.preventDefault();
							jsHistory.set(mailru.getPageURL('readmsg', { id: message.PrevId }) + queryString);
						}
						else if( code == jsEvent.Key['down'] && message.NextId ){
							evt.preventDefault();
							jsHistory.set(mailru.getPageURL('readmsg', { id: message.NextId }) + queryString);
						}
					}
					else if (code == jsEvent.Key['left'] && message.PrevId) {
						evt.preventDefault();
						jsHistory.set(mailru.getPageURL('readmsg', { id: message.PrevId }) + queryString);
					} else if (code == jsEvent.Key['right'] && message.NextId) {
						evt.preventDefault();
						jsHistory.set(mailru.getPageURL('readmsg', { id: message.NextId }) + queryString);
					}
				} else {
					if (code == jsEvent.Key['delete']) {
						mailru.Messages.edit('remove', message.Id);
						evt.preventDefault();
					}
				}
			}
		}
	});

	jsLoader.loaded('{mailru.view}mailru.View.HotKeys', 1);

// data/ru/images/js/ru/Views/mailru.View.HotKeys.js end

// data/ru/images/js/ru/Views/mailru.View.Pager.js start

/**
 * @class	mailru.View.Pager
 * @author	RubaXa	<trash@rubaxa.org>
 */


// data/ru/images/js/ru/jsCore/labs/TemplateService.js start


jsClass
	.create('Template')
	.statics({
		  OPEN:		'#'
		, CLOSE:	'#'
	})
	.methods({

		__construct: function (name, node, type)
		{
			if( !Template._ )
			{
				Template._		= true;
				Template.O	= Template.OPEN.replace(/(\$|\{|\}|\(|\)])/g, '\\$1');
				Template.C	= Template.CLOSE.replace(/(\{|\}|\(|\)])/g, '\\$1');
			}

			this._name		= name;
			this._var		= new RegExp(Template.O + '([\\w_-]+)' + Template.C, 'ig');
			this._ifr		= new RegExp(Template.O + 'IF:([!\\w_"\'*/+%\s()|&<>=-]+)'+ Template.C +'(.*)'+ Template.O+ 'FI'+ Template.C, 'ig');
			this._tpl		= new RegExp(Template.O + 'include:([\\w_-]+)' + Template.C, 'ig');
			this._ifEval	= [];
			this._ifEval_	= {};

			this.reset();

			if( typeof node == 'string' )
			{	// Text template OR Selector
				this._n		= jQuery(node);
				this._h		= node;
				this._t		= 1;
			}
			else
			{
				this._n		= jQuery(node);
				if( !this._n.length ) return;

				this._h		= jQuery.trim(this._n[0].innerHTML);
				this._t		= 1;
			}


			this._if	= {};	// IFs
			this._ifs	= this._ifr.test(this._h);	// IF support

			if( this.isText() )
			{
				this._h = this._h.replace(this._tpl, function (a, b){ return TemplateService.get(b).getText(); });

				var x = 0, s, e, i = 0, self = this, _if = new RegExp(Template.O + 'IF:([!\\w_"\'*/+%\\s()|&<>=-]+)' + Template.C, 'ig');
				this._h			= this._h.replace(_if, function (a, b){ return [Template.OPEN+'IF', i++, ':', self._if2eval(b), Template.CLOSE].join(''); });
				this._ifCount	= i;
				for( ; i--; )
				{
					x		= 2 + Template.OPEN.length;
					e		= this._h.indexOf(Template.OPEN+'FI'+Template.CLOSE, this._h.indexOf(Template.OPEN+'IF'+i+':'));
					this._h	= this._h.substr(0, e+x) +i+ this._h.substr(e+x);
				}
			}

			TemplateService.add(name, this);
		},


	// @private
		_if2eval: function (expr)
		{
			var a = expr.replace(/([a-z_]+)/ig, "P.get('$1', values, idx)");
			if( !this._ifEval_[a] ) this._ifEval_[a] = this._ifEval.push(a);
			return	this._ifEval_[a];
		},

		_text: function (P)
		{
			var t = this._h;

			if( this._arVars )
			{
				var r = [], i = this._arVars.length, n = i - 1;
				for( ; i--; ) r[i] = this.__test(t, P, this._arVars[i], i, n);
				t = r.join('');
			}
			else if( this._ivars ) t = this.__test(t, P, this._vars, 1, 1);
			else t = t.replace(this._ifr, '');

			return	t;
		},

		__test: function (txt, P, values, idx, len)
		{
			values.__first	= idx == 0;
			values.__last	= idx == len;

			P.set(values);

			if( this._ifCount )
			{
				this._ifEvalResult = {};
				var i = this._ifCount, il, s, e, v, c, not;

				for( ; i--; )
				{
					il	= (i+'').length + Template.OPEN.length + 3;
					s	= txt.indexOf(Template.OPEN + 'IF' + i + ':');
					c	= txt.indexOf(Template.CLOSE, s + il);
					v	= txt.substring(s + il, c)*1; // eval index
					e	= txt.indexOf(Template.OPEN + 'FI' + i + Template.CLOSE);


					if( typeof this._ifEvalResult[v] == 'undefined' )
					{	// caching eval result
						this._ifEvalResult[v] = eval('('+this._ifEval[v-1] +')');
					}

					txt	= txt.substring(0, s)
						+ (this._ifEvalResult[v] ? txt.substring(c + Template.CLOSE.length, e) : '')
						+ txt.substring(e + il)
					;
				}
			}

			var self = this;
			return	txt.replace(this._var, function (a, b)
			{
				return	self._vars[b] || P.get(b, values, idx);
			});
		},



	// @public
		getNode: function (){ return this._n;},
		isText: function () { return !!this._t; },
		getText: function (){ return this._h; },

		set: function (key, value)
		{
			this._ex	= 0;
			if( !this._ivars ) this._ivars	= 1;
			this._arVars = key;
			return	this;
		},

		get: function (key)
		{
			return key ? this._vars[key] : this._vars;
		},

		reset: function ()
		{
			this._vars		= {};
			this._arVars	= 0;
			this._ivars		= 0;
			this._ex		= 0;
			this.result		= undefined;
			return	this;
		},

		parser: function (P)
		{
			if( !P ) return this._tp;
			if( this._tp !== P )
			{
				if( P in TemplateParser ) P = TemplateParser[P];
				if( P.constructor !== TemplateParser ) P = new TemplateParser( P );
				this._tp	= P;
				this._ex	= 0;
				this.result	= undefined;
			}
			return	this;
		},

		exec: function (Parser)
		{
			if( !this._n.length ) return '';
			if( !this._ex )
			{
				if( !this._tp ) this.parser( TemplateParser[this._name] || TemplateParser.Base );

				this._ex	= 1;
				this.result	= this[this.isText() ? '_text' : '_jquery'](Parser || this._tp);
			}
			return	this.result;
		},

		toString: function (){ return this.exec(); }

	});


	TemplateService = jsClass
	.create()
	.methods({

		__construct: function ()
		{
			this._tpl		= {};
			this._exists	= {};
		},

	// @public
		get: function (name, node)
		{
			if( !this.has(name) ) this.add(name, new Template( name, node || $F('tpl-'+name) ));
			return	this._tpl[name].reset();
		},

		has: function (name){ return !!this._exists[name]; },

		add: function (name, Tpl)
		{
			if( !this.has(name) )
			{
				this._exists[name]	= 1;
				if( Tpl.constructor !== Template ) Tpl = new Template(name, Tpl);
				this._tpl[name]	= Tpl;
			}
			return	this;
		},

		load: function (){ throw "TemplateService.load -- must be defined"; },
		need: function (tpls){ return Array.filter(tpls, function (name){ return !TemplateService._tpl[name]; }); }

	}).getInstance();



	TemplateParser = jsClass
	.create()
	.methods({

		__construct: function (methods)
		{
			var values = {};

			$E(this, methods);

			this.set	= function (val){ values = val; return this; };
			this.val	= function (key, def){ return _hv(key) ? values[key] : def; };

			function _hv(key){ return typeof values[key] != 'undefined'; };
		},

	// @public
		get: function (key, values, idx)
		{
			var val = this[key] ? this[key](values, idx) : this.val(key, '');
			return	val;
		}

	});
	TemplateParser.Base = new TemplateParser;
	TemplateParser.add	= function (name, Parser)
	{
		if( Parser.constructor !== TemplateParser ) Parser = new TemplateParser(Parser);
		this[name] = Parser;
	};

	jsLoader.loaded('{labs}TemplateService', 1);

// data/ru/images/js/ru/jsCore/labs/TemplateService.js end

/**
	 * @class mailru.Pager
	 */
	jsClass.create('mailru.Pager')
		.statics({

		calc: function ()
		{
			var F	= mailru.Folders.get();
			if( F !== undef )
			{
				var
					  count		= F.Messages*1
					, perPage	= mailru.messagesPerPage * 1
					, pages		= Math.ceil(count / perPage)
					, page		= Math.min((GET.page || 1) * 1, pages)
					, group		= 5
					, f 		= Math.floor((page - 1) / group) * group
					, t 		= Math.min(f + group, pages)
				;

				this.fID		= F.Id;
				this.prePage	= perPage;
				this.page		= page;
				this.pages		= pages;
				this.onPage		= page == pages ? Math.min(count - (page-1) * perPage, perPage) : perPage;
				this.to			= t;
				this.from		= f;
				this.total		= count;
			}
		}
	});

	/**
	 * @class mailru.View.Pager
	 */
	jsView
		.create('mailru.View.Pager')
		.methods({

		_first: function ()
		{
			mailru.Pager.calc();
			this.isChange('hash', [GET.folder, mailru.Pager.page, mailru.Pager.total]);
		},

		_redraw: function (r, a)
		{
			mailru.Pager.calc();

			var
				  page		= mailru.Pager.page
				, count		= mailru.Pager.total
				, prePage	= mailru.Pager.prePage
				, pages		= mailru.Pager.pages
				, group		= 5
				, html		= [], i = 0
				, f 		= mailru.Pager.from
				, t 		= mailru.Pager.to
			;

			if( (a && !r) || (r && a && this.isChange('hash', [jsHistory.get(), page, count])) )
			{
				if( count > prePage )
				{
					if( page > 1 ) html[i++] = '<a class="paging__item paging__item_prev icon icon_paging-horizontal icon_arrow-left" rel="history" href="#url#&page=#prev_page#" title="'+Lang.get('Pager').prev+'"></a>';
					if( pages > 5 && page > 3 ) html[i++] = '<a class="paging__item" rel="history" href="#url#&page=1">1</a>';
					if( page > 4 && pages > 6 ) html[i++] = '<span class="paging__item">&hellip;</span>';

					f	= Math.max(page - (pages - page < 3 ? 5 - (pages - page) : 3), 0);
					t	= Math.min(f + 5, pages);

					for( var p = f, n; p < t; p++ )
					{
						n = p + 1;

						if( page == n ) html[i++] = '<span class="paging__item paging__item_selected">'+ n +'</span>';
						else html[i++] = '<a class="paging__item" rel="history" href="#url#&page='+ n +'">' + n + '</a>';
					}

					if( pages > 6 && pages - page > 3 ) html[i++] = '<span class="paging__item">&hellip;</span>';
					if( pages > 5 && pages - page > 2 ) html[i++] = '<a class="paging__item" rel="history" href="#url#&page='+pages+'">'+pages+'</a>';
					if( page < pages ) html[i++] = '<a class="paging__item paging__item_next icon icon_paging-horizontal icon_arrow-right" rel="history" href="#url#&page=#next_page#" title="'+Lang.get('Pager').next+'"></a>';


					var
					  url = jsHistory.get().split('?')
					, tpl = {
						  folder_id:	GET.folder
						, prev_page:	page - 1
						, next_page:	page + 1
						, prev_group:	f
						, next_group:	t + 1
						, sort_by:		mailru.messagesSort
						, url:			url[0] +'?'+ (url[1] || '').replace(/[\?&]*(page)=\d+/ig, '')
					};

					this.getView().display(1).innerHTML( html.join('').replace(/#(\w+)#/ig, function (a, n){ return tpl[n]; }) )
				}
				else
				{
					this.getView().display(0);
				}

				f = (page-1) * prePage + 1;
				t = Math.min(f + prePage - 1, count);

				if( pages < 2 )
				{
					this.$Info
						.display(pages == 1)
						.eq(0).innerHTML( count ? String.num(t, Lang.get('Messages').letter, ' ') : '' ).end()
						.eq(1).innerHTML('')
					;
				}
				else
				{
					var L = Lang.get('Pager');
					this.$Info
						.display(1)
						.eq(0).innerHTML(String.sprintf(L.infoTop, f, t, count)).end()
						.eq(1).innerHTML(String.sprintf(L.infoBottom, f, t, count))
					;
				}
			}
		},

		getView: function ()
		{
			this._init('view', function ()
			{
				this.$View	= $( this.idView );
				this.$Info	= $( this.idInfo );
			});
			return	this.$View;
		}

	});

	jsLoader.loaded('{mailru.view}mailru.View.Pager', 1);

// data/ru/images/js/ru/Views/mailru.View.Pager.js end

// data/ru/images/js/ru/Views/mailru.View.Banners.js start

/**
 * @class mailru.View.Banners
 */

(function (){
	var _rRBOptions = /<!--RB:(.+?)-->/;

	jsClass
		.create('mailru.View.Banners')
		.methods({

		__construct: function (){
			this._cntTS		    = 0;
			this._bannerTS      = 0;
			this._bnrsPrevTS    = ajs.now();

			this._reloadedTryCatch = function (){
				try {
					this._reloaded.apply(this, arguments);
				} catch( err ){
					mailru.saveError('js6', ['MAILRU.VIEW.BANNERS', encodeURIComponent(err.toString())]);
				}
			}.bind(this);


			this._autoReload    = function (){
				if( mailru.AutoReloadBanners ){
					ajs.clearSleep(this._autopid);
					this._autopid = ajs.loop(this._reloadBanners, 3*60*1000);
				}
			}.bind(this);
			this._reloadBanners = function (){ if( !ajs.blurred ) this.reload({ cnt: 'N' }); }.bind(this);

			this._autoReload();
		},

		left:	jsCore.F,
		redraw: jsCore.F,

		reload: function (opts) {
			if (typeof fixedDocumentWrite == 'function')
				fixedDocumentWrite(document);

			var path = jsHistory.get().split('?')[0];
			if( this._path != path ){
				this._path  = path;
				this._cntTS = this._bannerTS = 0;
			}

			var ts = ajs.now(), data = ajs.extend({
				  ref:		mailru.getPageLabel()
				, cnt:		(ts - this._cntTS > 1000 ? 'Y' : 'N')
				, bnrs:		(!this._bannersReq && (ts - this._bannerTS > 3000) && !mailru.isComposePage() ? 'Y' : 'N')
				, nav:		'Y'
				, start:	mailru.LogoToMsglist ? 'N' : 'Y'
				, newsnippets: ~~mailru.newsnippets
				, composelabels:  ~~mailru.ComposeLabels
				, IsMyCom:     ~~mailru.IsMyCom
				, IMAPBanner:  ~~mailru.IMAPBanner
			}, opts);

			if( mailru.isReadMsg ){
				// Get FromDomain, for left banner
				var M = mailru.Messages.get( GET.id );
				if( M && M.From ) data.from = M.From.split('@')[1];
			}
			else if( mailru.isSendMsgOk && (mailru.Folders.COUNT >= 9) ){
				// Left banner
				data.bnrs	= 'N';
			}

			if( mailru.IS_PREVIEW ){
				data.preview = mailru.IS_PREVIEW;
			}

			if( (data.cnt == 'Y' && !this._cntReq) || (data.bnrs == 'Y' && !this._bannersReq) ){
				if( data.cnt == 'Y' ){
					this._cntTS = ts;
					this._cntReq = true;
				}

				if( data.bnrs == 'Y' ){
					this._bannerTS = ts;
					this._bannersReq = true;
				}

				$('#rb-context-left-slots').display( mailru.isMsgList || mailru.isReadMsg || mailru.isSentMsg || mailru.isSearchPage() || mailru.isFileSearchPage() );
				$('#SendMsgOkLeftSlot').display( mailru.isSendMsgOk );

				var showSlotContainer2 = mailru.isMsgList || mailru.isReadMsg || mailru.isSearchPage() || mailru.isFileSearchPage();
				$('#slot-container_2').display( showSlotContainer2 );
				$('#slot-container_2_separator').display( !showSlotContainer2 );

				var ad = mailru.Ad.getById('advertising-topline');
				if( ad ){
					ad.disabled = true;
				}

				/** @namespace mailru.UseRB_API -- head__js, MAIL-14244 */
				if( mailru.UseRB_API ){
					_getXhrRBSlots(data).done(this._reloadedTryCatch);
				}
				else {
					$.ajax({
						  url:      '/tmpl/static?get=rnb&now='+ts
						, data:     data
						, dataType: 'json'
						, success:  this._reloadedTryCatch
					});
				}
			}
			else if( this.__sendMsgOk !== mailru.isSendMsgOk ){
				$(mailru.isSendMsgOk ? '#SendMsgOkLeftSlot' : '#slot-container_2').empty();
			}

			this.__sendMsgOk = mailru.isSendMsgOk;
		},

		_reloaded: function (R){
			if( !mailru.UseRB_API ){
				this._cntReq = false;
				this._bannersReq = false;
			}

			if( R && R.status == 'OK' ){
				var D = R.data, info = [];

				if( D.cnt == 'Y' ){
					this._cntReq = false;
				}

				if( D.bnrs == 'Y' ){
					this._bannersReq = false;
					this._bnrsPrevTS = ajs.now();

					if( D.left ){
						var
							RB = ajs.toObject(D.left.match(_rRBOptions) && RegExp.$1 || ''),
							$Left = $(mailru.isSendMsgOk ? '#SendMsgOkLeftSlot' : '#slot-container_2'),
							LeftDirect  = mailru.Ad.find(function (Ad){ return Ad.getId() == 'direct-left' })[0]
						;

						/** @namespace mailru.Ad.RB_noncommercial_enabled */
						if( !mailru.Ad.RB_noncommercial_enabled ){
							RB.noncommercial    = 0;
						}

						if( LeftDirect && LeftDirect.ads[0] ){
							// https://jira.mail.ru/browse/MAIL-5155
							LeftDirect.ads[0].limit = RB.noncommercial ? 6 : 3;
						}


						/** @namespace RB.noncommercial */
						if( RB.noncommercial != 1 ){
							info.push('left banner');
							$Left.html( D.left );
						} else {
							info.push('left banner -- is non commercial');
							$Left.empty();
						}

						$('#slot-container_2_separator').display(!!RB.noncommercial);

						info.push(Math.round((ajs.now()-this._bnrsPrevTS)/1000)+'s');
					}

					if( D.line && D.line != '__AUTO__' ){
						var lineName = D.ref+'-topline';
						info.push(lineName+' banner');
						mailru.Ad.push({
							'id': lineName,
							'placeId': 'RBLine',
							'type': 'rbline',
							'ads': [{'html': D.line}]
						});
					}
					else if( !D.line ){
						// По идее это должно РБ отдавать, если ничего не нашло, а чиновники не воровать, так что лучше так.
						D.line = '__AUTO__';
					}


					if( D.line == '__AUTO__' ){
						var ad = mailru.Ad.getById('advertising-topline');
						if( ad ){
							ad.disabled = false;
						}
					}
				}

				if( D.nav ){
					info.push('nav');
					$('#portal__banner').html( document.parseWrite(D.nav) );
				}

				if( $.trim(D.leftInformer) ){
					info.push('leftInformer');
					$('#AdLeftInformer').html( document.parseWrite(D.leftInformer) ).show();
				}
				else {
					$('#AdLeftInformer').empty().hide();
				}

				if( $.isArray(D.counters) ){
					info.push('counters');
					$('#_counters_').html( document.parseWrite(D.counters.join('')) );
				}


				$(window).triggerHandler('refresh.ad');

				if( info.length ){
					debug.log('INFO: ' + info.join(' & ') + ' -- reloaded');
				}
			}
			else {
				this._cntReq = false;
				this._bannersReq = false;
			}

			this._autoReload();
		}

	});


	// @todo: Переместить в отдельный файл
	var rbSlots = {
		sz: {
			  msglist: 10
			, messages: 10
			, readmsg: 11
			, message: 11
			, sentmsg: 12
			, compose: 12
			, sendmsgok: 13
			, addressbook: 21
		},
		line: {
			_get: function (p, r){
				return !mailru.v2 && p.bnrs != 'N' && 3003;
			}
		},
		left: {
			def: mailru.IsMyCom ? 1490 : 2902,
			sentmsg: 0,
			compose: 0,
			sendmsgok: 0,
			_get: function (p, r){
				return p.bnrs != 'N' && mailru.Ad.urls[p.ref+'-topline'] && (this[p.ref] || this.def);
			}
		},
		counters: {
			_get: function (p, r){
				return p.cnt != 'N' && [2200, 2243];
			}
		},
		nav: {
			_get: function (p, r){
				return p.bnrs != 'N' && 2430;
			}
		},
		leftInformer: {
			_get: function (p, r){
				if( /sentmsg|compose/.test(p.ref) && p.composelabels ){
					r.sz = 24;
				}
				return p.bnrs != 'N' && 1236;
			}
		}
	};


	function _getXhrRBSlots(params){
		var q = [], df = new $.Deferred, data = { 'q[]': q };

		ajs.each(rbSlots, function (slot, name){
			if( slot._get ){
				var req = {/*params*/}, id = slot._get(params, req);
				if( id ){
					req.n = name;
					req = ajs.toQuery(req);
					ajs.each([].concat(id), function (id){
						q.push(req.length ? id+'?'+req : id);
					});
				}
			}
		});

		data.sz = rbSlots.sz[params.ref];

		/** @namespace mailru.EXPERIMENTID */
		if( mailru.EXPERIMENTID ){
			data.test_id = mailru.EXPERIMENTID;
		}

		/** @namespace mailru.SITEID */
		if( mailru.SITEID ){
			data._SITEID = mailru.SITEID;
		}

		$.getJSON("//ad.mail.ru/adq/?callback=?", data).done(function (slots/**Array*/){
			var res = {};
			ajs.each(slots, function (slot){
				res[slot.name] = res[slot.name] ? [].concat(res[slot.name], slot.html) : slot.html;
			});

			res.ref = params.ref;
			res.cnt = params.cnt;
			res.bnrs = params.bnrs;

			df.resolve({ status: 'OK', data: res });
		}).fail(df.reject);

		return	df;
	}

	jsLoader.loaded('{mailru.view}mailru.View.Banners', 1);
})();

// data/ru/images/js/ru/Views/mailru.View.Banners.js end

// data/ru/images/js/ru/Views/mailru.View.Folders.js start

/**
 * @class	mailru.View.Folders
 * @author	RubaXa	<trash@rubaxa.org>
 */


// ./data/ru/fest/blocks/messagelist/messagelist__dropdown-moveto.js start

;(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['blocks/messagelist/messagelist__dropdown-moveto']=function (__fest_context){"use strict";var __fest_self=this,__fest_buf=[],__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html=[],__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}var json=__fest_context;(function(__fest_context){(function(__fest_context){__fest_blocks.dropdown__button=function(params){var __fest_buf=[];__fest_buf.push("<div class=\"dropdown__button");try{__fest_if=params.cssClass}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.cssClass))}catch(e){__fest_log_error(e.message + "10");}}__fest_buf.push("\"><i class=\"dropdown__arrow\"><i class=\"dropdown__arrow__inner\"></i></i> <span class=\"dropdown__button__text\">");try{__fest_buf.push(__fest_escapeHTML(params.text))}catch(e){__fest_log_error(e.message + "21");}__fest_buf.push("</span></div>");return __fest_buf.join("");};})(__fest_context);(function(__fest_context){(function(__fest_context){__fest_blocks.dropdown__list__item=function(params){var __fest_buf=[];__fest_buf.push("<div class=\"dropdown__list__item");try{__fest_if=params.cssClass && params.cssClass.item}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.cssClass.item))}catch(e){__fest_log_error(e.message + "10");}}try{__fest_if=params.disabled}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown__list__item_disabled form_disabled");}__fest_buf.push("\"");try{__fest_if=params.hidden}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" style=\"display:none\"");}__fest_buf.push(">");try{__fest_attrs[0]=__fest_escapeHTML(params.href)}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<a href=\"" + __fest_attrs[0] + "\" class=\"dropdown__list__item__link");try{__fest_if=params.icon && params.icon.align}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown__list__item__link_with-icon-");try{__fest_buf.push(__fest_escapeHTML(params.icon.align))}catch(e){__fest_log_error(e.message + "31");}}try{__fest_if=params.selected}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown__list__item__link_selected");}try{__fest_if=params.cssClass && params.cssClass.link}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.cssClass.link))}catch(e){__fest_log_error(e.message + "41");}}__fest_buf.push("\"");try{__fest_if=params.onclick}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" onclick=\"");try{__fest_buf.push(__fest_escapeHTML(params.onclick))}catch(e){__fest_log_error(e.message + "47");}__fest_buf.push("\"");}try{__fest_if=params.id}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" data-id=\"");try{__fest_buf.push(__fest_escapeHTML(params.id))}catch(e){__fest_log_error(e.message + "53");}__fest_buf.push("\"");}__fest_buf.push(">");try{__fest_if=params.icon}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<i class=\"icon dropdown__list__item__icon");try{__fest_if=params.icon.icon}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.icon.icon))}catch(e){__fest_log_error(e.message + "66");}}__fest_buf.push(" ");try{__fest_if=params.icon.align}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("dropdown__list__item__icon_");try{__fest_buf.push(__fest_escapeHTML(params.icon.align))}catch(e){__fest_log_error(e.message + "73");}}else{__fest_buf.push("dropdown__list__item__icon_right");}__fest_buf.push("\"></i>");}__fest_buf.push("<span class=\"dropdown__list__item__link__text\">");try{__fest_buf.push(__fest_escapeHTML(params.text))}catch(e){__fest_log_error(e.message + "86");}__fest_buf.push("</span></a></div>");return __fest_buf.join("");};})(__fest_context);(function(__fest_context){__fest_blocks.dropdown__list__item_checkbox=function(params){var __fest_buf=[];try{__fest_attrs[0]=__fest_escapeHTML(params.id)}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<label data-id=\"" + __fest_attrs[0] + "\" class=\"js-dropdown-item form__dropdown__item form__checkbox form__checkbox_flat");try{__fest_if=params.cssClass && params.cssClass.item}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.cssClass.item))}catch(e){__fest_log_error(e.message + "10");}}try{__fest_if=params.checked}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" form__checkbox_flat_checked");try{__fest_if=params.disabled}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" form__checkbox_flat_checked-half");}}try{__fest_if=params.disabled}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown__list__item_disabled form_disabled");}__fest_buf.push("\"");try{__fest_if=params.hidden}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" style=\"display:none\"");}try{__fest_if=params.name}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" id=\"");try{__fest_buf.push(__fest_escapeHTML(params.name))}catch(e){__fest_log_error(e.message + "35");}__fest_buf.push("_");try{__fest_buf.push(__fest_escapeHTML(params.id))}catch(e){__fest_log_error(e.message + "37");}__fest_buf.push("\"");}__fest_buf.push(">");try{__fest_attrs[0]=__fest_escapeHTML(params.id)}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<input type=\"checkbox\" class=\"form__checkbox__checkbox\" value=\"" + __fest_attrs[0] + "\"");try{__fest_if=params.selected}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" checked=\"checked\"");}__fest_buf.push("/><i class=\"form__checkbox__icon icon icon_form icon_form_checkmark\"></i><span class=\"form__checkbox__label\">");try{__fest_buf.push(params.text)}catch(e){__fest_log_error(e.message + "53");}__fest_buf.push("</span></label>");return __fest_buf.join("");};})(__fest_context);__fest_blocks.dropdown__list=function(params){var __fest_buf=[];try{__fest_attrs[0]=__fest_escapeHTML(params.border ? '' : 'dropdown__list__scroll-without-border')}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<div class=\"js-scroll-list dropdown__list__scroll " + __fest_attrs[0] + "\">");try{__fest_if=params.extraLabels}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_select="dropdown__list__item_checkbox";__fest_params={};try{__fest_params={hidden: true}}catch(e){__fest_log_error(e.message)}__fest_fn=__fest_blocks[__fest_select];if (__fest_fn)__fest_buf.push(__fest_call(__fest_fn,__fest_params,false));}var index,value,__fest_to0,__fest_iterator0;try{__fest_iterator0=params.items || [];__fest_to0=__fest_iterator0.length;}catch(e){__fest_iterator0=[];__fest_to0=0;__fest_log_error(e.message);}for(index=0;index<__fest_to0;index++){value=__fest_iterator0[index];try{__fest_if=value.hr}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<div class=\"dropdown__list__hr\"></div>");}else{try{__fest_if=value.checkbox}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_select="dropdown__list__item_checkbox";__fest_params={};try{__fest_params=value}catch(e){__fest_log_error(e.message)}__fest_fn=__fest_blocks[__fest_select];if (__fest_fn)__fest_buf.push(__fest_call(__fest_fn,__fest_params,false));}else{__fest_select="dropdown__list__item";__fest_params={};try{__fest_params=value}catch(e){__fest_log_error(e.message)}__fest_fn=__fest_blocks[__fest_select];if (__fest_fn)__fest_buf.push(__fest_call(__fest_fn,__fest_params,false));}}}__fest_buf.push("</div>");return __fest_buf.join("");};})(__fest_context);__fest_blocks.dropdown=function(params){var __fest_buf=[];__fest_buf.push("<div class=\"dropdown");try{__fest_if=!params.active}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown_disabled");}try{__fest_if=params.cssClass}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(params.cssClass))}catch(e){__fest_log_error(e.message + "18");}}__fest_buf.push("\"");try{__fest_if=params.id}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" id=\"");try{__fest_buf.push(__fest_escapeHTML(params.id))}catch(e){__fest_log_error(e.message + "24");}__fest_buf.push("\"");}__fest_buf.push(">");try{__fest_select='dropdown__' + params.control.type}catch(e){__fest_select="";__fest_log_error(e.message)}__fest_params={};try{__fest_params=params.control}catch(e){__fest_log_error(e.message)}__fest_fn=__fest_blocks[__fest_select];if (__fest_fn)__fest_buf.push(__fest_call(__fest_fn,__fest_params,false));try{__fest_attrs[0]=__fest_escapeHTML(params.name)}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<div data-name=\"" + __fest_attrs[0] + "\" style=\"display: none;\" class=\"dropdown__list js-menu");try{__fest_if=!params.top}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" dropdown__list_bottom");}__fest_buf.push("\">");try{__fest_if=params.head}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<div class=\"js-info dropdown__list__top\"><div class=\"dropdown__list__item\"><div class=\"dropdown__list__item__more dropdown__list__item__more_note\"><span class=\"dropdown__list__item__more__text\">");try{__fest_buf.push(params.head.text)}catch(e){__fest_log_error(e.message + "47");}__fest_buf.push("</span></div><div class=\"dropdown__list__hr\"></div></div></div>");}__fest_select="dropdown__list";__fest_params={};try{__fest_params=params}catch(e){__fest_log_error(e.message)}__fest_fn=__fest_blocks[__fest_select];if (__fest_fn)__fest_buf.push(__fest_call(__fest_fn,__fest_params,false));try{__fest_if=params.foot}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<div class=\"dropdown__list__bottom\"><div class=\"dropdown__list__item\"><a class=\"dropdown__list__item__link\" href=\"");try{__fest_buf.push(__fest_escapeHTML(params.foot.href))}catch(e){__fest_log_error(e.message + "61");}__fest_buf.push("\"");try{__fest_if=params.foot.onclick}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push(" onclick=\"");try{__fest_buf.push(__fest_escapeHTML(params.foot.onclick))}catch(e){__fest_log_error(e.message + "63");}__fest_buf.push("\"");}__fest_buf.push("><span class=\"dropdown__list__item__link__text\">");try{__fest_buf.push(__fest_escapeHTML(params.foot.text))}catch(e){__fest_log_error(e.message + "66");}__fest_buf.push("</span></a></div></div>");}__fest_buf.push("</div></div>");return __fest_buf.join("");};})(__fest_context);__fest_select="dropdown";__fest_params={};try{__fest_params={
			  id:		'folderListSpan' + (json.top ? 'Top' : 'Bot')
			, name:		'folders'
			, control:	{ type: 'button', text: Lang.str('dropdown.moveto') }
			, top:		json.top
			, border:	true

			, head:		{ text: Lang.str('dropdown.more.empty') }

			, foot:		{
							  href:		'#new'
							, onclick:	"return ['folder', 'move', 'new'];"
							, text:		Lang.str('create.folder')
						}

			, items:	ajs.map(mailru.Folders.getAll(), function (folder) {
							return {
								  id:		folder.id
								, href:		'#'
								, text:		folder.Name
								, cssClass: { item: 'js-FDD'+folder.id+' '+(folder.IsSubfolder ? 'dropdown__list__item_sub' : '') }
								, onclick:	"return ['folder', 'move', '"+folder.id+"']"
								, disabled:	mailru.Router.request.query.folder == folder.id
							};
						})
		}}catch(e){__fest_log_error(e.message)}__fest_chunks.push(__fest_buf.join(""),{name:__fest_select,params:__fest_params,cp:false});__fest_buf=[];try{__fest_if=json.top}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<input class=\"js-InpToFolderId\" type=\"hidden\" value=\"\" name=\"folder\" id=\"InpToFolderId\"/>");}__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html.push(__fest_chunk);} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html.push(__fest_call(__fest_fn,__fest_chunk.params, __fest_chunk.cp));}}__fest_html.push(__fest_buf.join(""));return __fest_html.join("")} else {return __fest_buf.join("");}}; if(x.jsLoader!==undefined&&x.jsLoader.loaded!==undefined&&typeof x.jsLoader.loaded==='function'){x.jsLoader.loaded('{festTemplate}blocks/messagelist/messagelist__dropdown-moveto', 1)};})();
// ./data/ru/fest/blocks/messagelist/messagelist__dropdown-moveto.js end

/**
	 * @class mailru.View.Folder
	 */
	jsView
		.create('mailru.View.Folder')
		.methods({

		clearProcessStatus: function (id, status){
			var $Alt = $('#ajax-alt-special-folder-'+id).add('#folder'+id);

			if( status == 'start' ){
				$('.js-folder-clear,.js-folder-clear-ok', $Alt).display(0);
				$('.js-folder-clear-loading', $Alt).display(1);
			}
			else if( status == 'end' ){
				$('.js-folder-clear', $Alt).display(1);
				$('.js-folder-clear-loading', $Alt).display(0);
			}
			else {
				$('.js-folder-clear', $Alt).display(0);
				$('.js-folder-clear-ok', $Alt).display(1);
			}
		},

		_one: function (){
			this.$View	= $( this.idView );
			this.isChange('id', GET.folder);

			var t = this;

			$('#ajax-alt-special-folder').delegate('.js-folder-clear', 'click', function (evt){
				var
					  F = mailru.Folders.get( $(evt.currentTarget).data('id') )
					, txt = Lang.get('folder.clear.confirm')
				;

				if( F && confirm((txt[F.getType()] || txt.def).replace('%s', F.Name)) ){
					t.clearProcessStatus(F.Id, 'start');

					mailru.Ajax({
						url: '/cgi-bin/clearfolder',
						type: 'POST',
						data: {
							ajax_call: 1,
							func_name: 'clear_folder',
							folder: F.Id
						},
						isUser: true,
						complete: function (R) {
							t.clearProcessStatus(F.Id, 'end');

							if( R.isOK() ){
								mailru.Updater.reload(true);
								mailru.Messages.set(F.Id, [], now(), 0);
								mailru.View.Messages.getActive().redraw();
								t.clearProcessStatus(F.Id, 'done');
							}
						}
					});
				}

				return	false;
			});
		},

		_changed: function ()
		{
			var F = mailru.Folders.get();
			return	this.isChange('hash', F ? F.getHash() : '', 1);
		},

		_redraw: function (r, a)
		{
			var F = mailru.Folders.getSafe();

			if( a ){
				this._init('base', function (){
					this.$Title		= $( this.idTitle );
					this.$MsgList	= $( this.idContent );
					this.$Empty		= $( this.idEmpty );
					this.$AddSender	= $( this.idSender, this.$View );
				});
			}

			if( !r ){
				this.$View.display( a );
			}

			if( r && this._init('base') && this.isChange('hash', F.getHash()) ){
				var e = !F.Messages, s = F.isSent() || F.isDrafts();

				this.$Title.innerHTML(
					  (F.isRoot() ? '' : F.getRoot().Name + ' / ')
					+ F.Name
				);

				if( this.isChange('id', F.Id) ){
					$('DIV', '#ajax-alt-special-folder').display(0);
					$('#ajax-alt-special-folder-'+F.Id)
						.display(1)
						.find('.js-folder-clear').display(!e).end()
						.find('.js-folder-clear-ok').display(0).end()
					;
				}

				if( this.isChange('sender', s) ){
					this.$AddSender.display(!s);
				}
			}
		}

	});
	// Folder.View

	/**
	 * @class mailru.View.Folders.DropDown
	 */
	jsView
		.create('mailru.View.Folders.DropDown')
		.methods({

		_one: function ()
		{
			this.$View		= $( this.idView );

			if( !mailru.isReadMsgPage() ) this.isChange('id', GET.folder);
			this.isChange('hash', mailru.Folders.getHash());

			$(this.cssElms, this.$View).removeClass(this.cssElms.replace('.', '') + '_disabled').dropdown({
				  link:			'.'+this.clLink
				, container:	'.'+this.clContainer
				, orientation:	'auto'
				, wrapperWidth:	function () { return $('#PageContent').width(); }
				, onToggle:		$D(this, function (s, D)
				{
					if (s && D.$link.parent().hasClass('dropdown_disabled')) {
						return false;
					}

					var name = D.$container.attr('data-name');
					this.expand	= s;

					$(window).triggerHandler('dropDownClick.msglist', [name, s]);

					if( s ) this._showDD(D);
					if( name == 'folders' ) this.redraw();

					if (s && name == 'message-media-view') {
						mailru.radar('MessageLineWithBal', 'menuClick=1');
						$(window).triggerHandler('dropDownViewLinkClick.msglist');
					}

				})
				, onClick:		$D(this, function (e, D)
				{
					var
						  $Item	= $(e.target)
						, item	= $onClick($Item, true)
						, name	= D.$container.attr('data-name')
					;

					if( !item ){
						$Item = $Item.parent();
						item	= $onClick($Item, true);
					}

					$(window).triggerHandler('dropDownLinkClick.msglist', [name, item]);

					D.hide();

					if( D.$container.hasClass('dropdown_disabled') || $Item.hasClass('dropdown__list__item_disabled') || $Item.parent().hasClass('dropdown__list__item_disabled') )
					{	// Dropdown or item disabled
						return	false;
					}
					else
					{
						if( item && !$Item.hasClass(this.clSel) )
						{	// [type, action, data]
							mailru.Events.fire(item[1]+'.'+item[0]+'.click', item[2]);
							return	false;
						}
					}

					if( (name != 'sort-messages') && (name != 'readmsg-more') )
					{
						return	false;
					}
				})
			});
		},

		_showDD: function (DD)
		{
			var
				  arId	= mailru.View.Messages.getActive().select() // get selected messages
				, $Box	= DD.$container
				, name	= $Box.attr('data-name') // get dropdown name
				, txt
				, F = mailru.Folders.getSafe()
			;


			if( name == 'folders' ){
				if( $Box.attr('data-hash') != mailru.Folders.getHash() ){
					var html = $.fest('blocks/messagelist/messagelist__dropdown-moveto', { top: $Box.hasClass('dropdown__list_bottom') });
					$Box
						.attr('data-hash', mailru.Folders.getHash())
						.empty()
						.append($('.js-menu', html).children())
					;
				}

				var
					  s = this.clSel
					, fId = -1
					, arFolderId = mailru.Messages.map(arId, function (X){ return X.FolderId })
					, n = arId.length
					, $Info = $Box.find('.js-info')
					, $Items = $Box.find('.dropdown__list__item')

				;

				if( n && Array.uniq(arFolderId).length == 1 ){
					fId	= arFolderId[0];
				}

				if( n ){
					$Items
						.removeClass('dropdown__list__item_disabled')
						.filter('.'+ s).removeClass(s).end()
						.filter('.js-FDD'+fId).addClass(s).end()
					;
				}
				else {
					$Items.addClass('dropdown__list__item_disabled');
				}

				$Info.toggle(!n);
			}
			else if( name == 'select-messages' )
			{	// Messages selector
				var n = arId.length;

				$('.js-if-ge-one', $Box).toggleClass('dropdown__list__item_disabled', !n);

				var email = (F.isSent() || F.isDrafts() ? 'To' : 'From');

				if( n )
				{
					txt	= Lang.get('dropdown.select-messages.'+email+'.prefix')
						+ Array
							.uniq(mailru.Messages.map(arId, function (M)
							{
								var F = mailru.Folders.get(M.FolderId, true);
								return M[(F.isSent() || F.isDrafts() ? 'To' : 'From')] || ('<' + Lang.get('message.email.unknown') + '>');
							}))
							.join(', ')
						;
				}

				$('.js-email .dropdown__list__item__link__text', $Box)
					.text(
						txt ? String.wordWrap(txt, 50, 120, '...') :
						Lang.get('dropdown.select-messages.'+ email +'.disabled')
				);

				$('.js-if-ne-all', $Box).toggleClass('dropdown__list__item_disabled', n == mailru.Pager.onPage);
			}
			else if( name == 'more' || name == 'readmsg-more' )
			{	// Dropdown "More"
				var n = arId.length;
				var $Info = $Box.find('.js-info');

				$Box.toggleClass('dropdown__list_disabled', !n); // disable dropdown, if messages not selected
				$Info.toggleClass('dropdown__list__item__more_note', !n);

				if (n) {

					txt	= Array.uniq(mailru.Messages.map(arId, function (M) {
						var F = mailru.Folders.get(M.FolderId, true);
						return M[(F.isSent() || F.isDrafts() ? 'To' : 'From')] || ('<' + Lang.get('message.email.unknown') + '>'); }
					));
					var l = txt.length;
					if( l > 3 ){
						txt = txt.slice(0, 2);
						txt = txt.join(', ');
						txt += Lang.get('addressee.and.more').replace('%s', String.num(l, Lang.get('addressee'))).replace('%n', l - 2);
					} else {
						txt = txt.join(', ');
					}

					$('.js-only-one', $Box).toggleClass('dropdown__list__item_disabled', l > 1 || txt.indexOf('@') === -1);
					$('.js-inboxOnly', $Box).toggleClass('dropdown__list__item_disabled', F.isSent() || F.isDrafts());
				}

				$Info.html( txt ? txt : Lang.get('dropdown.more.empty') );
			}
			else if( name == 'mark' )
			{
				var read = 0, flag = 0, n = arId.length, $Info = $Box.find('.js-info');

				mailru.Messages.forEach(arId, function (M) {
					if (!M.Unread) read++;
					if (M.Flagged) flag++;
				});

				$Info.toggle(!n);

				var cn = 'dropdown__list__item_disabled';
				$Box
					.find('.js-mark-readed').toggleClass(cn, !n || read == n).end()
					.find('.js-mark-unread').toggleClass(cn, !n || read == 0).end()
					.find('.js-mark-flagged').toggleClass(cn, !n || flag == n).end()
					.find('.js-mark-unflagged').toggleClass(cn, !n || flag == 0).end()
				;
			}
		},


		destroy: function (){
			if( this.$View ){
				$(this.cssElms, this.$View).dropdown('destroy');
				this.$View = null;
				this.idView = null;
			}
		}

	});
	// DropDown;

	/**
	 * @class mailru.View.Folder.SpamButtons
	 */
	jsView
		.create('mailru.View.Folder.SpamButtons')
		.methods({

		_redraw: function (r, a){
			var F = this.getFolder();

			if( r && this.isChange('id', F.Id) ){
				this.getView().display(0);

				if( !(F.isDrafts() || F.isSent()) ){
					this.getView()
						.filter(F.isBulk() ? '.js-is-nospam' : '.js-is-spam').display(1).end()
						.filter('.ajax-add-sender').display(1).end()
					;
				}

				this.getView().parent().find('.js-remove').toggleClass('button-a_left', !(F.isDrafts() || F.isSent()));
			}
		},

		getFolder: function (){
			return	mailru.Folders.getSafe(mailru.getFolderId());
		}

	}); // DropDown

	jsLoader.loaded('{mailru.view}mailru.View.Folders', 1);

// data/ru/images/js/ru/Views/mailru.View.Folders.js end

// data/ru/images/js/ru/Views/mailru.View.Messages.js start

/**
 * @class	mailru.View.Messages
 * @author	RubaXa	<trash@rubaxa.org>
 */


// data/ru/images/js/ru/jsCore/jquery/easing.js start


/*****
	 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
	 *
	 * Uses the built in easing capabilities added In jQuery 1.1
	 * to offer multiple easing options
	 *
	 * TERMS OF USE - jQuery Easing
	 *
	 * Open source under the BSD License.
	 *
	 * Copyright В© 2008 George McGinley Smith
	 * All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without modification,
	 * are permitted provided that the following conditions are met:
	 *
	 * Redistributions of source code must retain the above copyright notice, this list of
	 * conditions and the following disclaimer.
	 * Redistributions in binary form must reproduce the above copyright notice, this list
	 * of conditions and the following disclaimer in the documentation and/or other materials
	 * provided with the distribution.
	 *
	 * Neither the name of the author nor the names of contributors may be used to endorse
	 * or promote products derived from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
	 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
	 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
	 * OF THE POSSIBILITY OF SUCH DAMAGE.
	 *
	*/

	(function ($)
	{

		// t: current time, b: begInnIng value, c: change In value, d: duration
		$.easing['jswing'] = $.easing['swing'];

		$.extend( $.easing,
		{
			def: 'easeOutQuad',
			swing: function (x, t, b, c, d) {
				return $.easing[$.easing.def](x, t, b, c, d);
			},
			easeInQuad: function (x, t, b, c, d) {
				return c*(t/=d)*t + b;
			},
			easeOutQuad: function (x, t, b, c, d) {
				return -c *(t/=d)*(t-2) + b;
			},
			easeInOutQuad: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t + b;
				return -c/2 * ((--t)*(t-2) - 1) + b;
			},
			easeInCubic: function (x, t, b, c, d) {
				return c*(t/=d)*t*t + b;
			},
			easeOutCubic: function (x, t, b, c, d) {
				return c*((t=t/d-1)*t*t + 1) + b;
			},
			easeInOutCubic: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t + b;
				return c/2*((t-=2)*t*t + 2) + b;
			},
			easeInQuart: function (x, t, b, c, d) {
				return c*(t/=d)*t*t*t + b;
			},
			easeOutQuart: function (x, t, b, c, d) {
				return -c * ((t=t/d-1)*t*t*t - 1) + b;
			},
			easeInOutQuart: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
				return -c/2 * ((t-=2)*t*t*t - 2) + b;
			},
			easeInQuint: function (x, t, b, c, d) {
				return c*(t/=d)*t*t*t*t + b;
			},
			easeOutQuint: function (x, t, b, c, d) {
				return c*((t=t/d-1)*t*t*t*t + 1) + b;
			},
			easeInOutQuint: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
				return c/2*((t-=2)*t*t*t*t + 2) + b;
			},
			easeInSine: function (x, t, b, c, d) {
				return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
			},
			easeOutSine: function (x, t, b, c, d) {
				return c * Math.sin(t/d * (Math.PI/2)) + b;
			},
			easeInOutSine: function (x, t, b, c, d) {
				return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
			},
			easeInExpo: function (x, t, b, c, d) {
				return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
			},
			easeOutExpo: function (x, t, b, c, d) {
				return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
			},
			easeInOutExpo: function (x, t, b, c, d) {
				if (t==0) return b;
				if (t==d) return b+c;
				if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
				return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
			},
			easeInCirc: function (x, t, b, c, d) {
				return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
			},
			easeOutCirc: function (x, t, b, c, d) {
				return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
			},
			easeInOutCirc: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
				return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
			},
			easeInElastic: function (x, t, b, c, d) {
				var s=1.70158;var p=0;var a=c;
				if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			},
			easeOutElastic: function (x, t, b, c, d) {
				var s=1.70158;var p=0;var a=c;
				if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
			},
			easeInOutElastic: function (x, t, b, c, d) {
				var s=1.70158;var p=0;var a=c;
				if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
				return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
			},
			easeInBack: function (x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c*(t/=d)*t*((s+1)*t - s) + b;
			},
			easeOutBack: function (x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			},
			easeInOutBack: function (x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
				return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
			},
			easeInBounce: function (x, t, b, c, d) {
				return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
			},
			easeOutBounce: function (x, t, b, c, d) {
				if ((t/=d) < (1/2.75)) {
					return c*(7.5625*t*t) + b;
				} else if (t < (2/2.75)) {
					return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
				} else if (t < (2.5/2.75)) {
					return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
				} else {
					return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
				}
			},
			easeInOutBounce: function (x, t, b, c, d) {
				if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
				return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
			}
		});

		/*
		 *
		 * TERMS OF USE - EASING EQUATIONS
		 *
		 * Open source under the BSD License.
		 *
		 * Copyright В© 2001 Robert Penner
		 * All rights reserved.
		 *
		 * Redistribution and use in source and binary forms, with or without modification,
		 * are permitted provided that the following conditions are met:
		 *
		 * Redistributions of source code must retain the above copyright notice, this list of
		 * conditions and the following disclaimer.
		 * Redistributions in binary form must reproduce the above copyright notice, this list
		 * of conditions and the following disclaimer in the documentation and/or other materials
		 * provided with the distribution.
		 *
		 * Neither the name of the author nor the names of contributors may be used to endorse
		 * or promote products derived from this software without specific prior written permission.
		 *
		 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
		 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
		 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
		 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
		 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
		 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
		 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
		 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
		 * OF THE POSSIBILITY OF SUCH DAMAGE.
		 *
		 */

	})(jQuery);

	jsLoader.loaded('{jQuery}easing', 1);


// data/ru/images/js/ru/jsCore/jquery/easing.js end

// data/ru/images/js/ru/mailru.MicroFormat.js start


if( !window.mailru ) window.mailru = {};

	mailru.MicroFormat		= (function()
	{
		var butseq = [
			['read-link', Lang.get('micoformat.read')],
			['reply-link', Lang.get('micoformat.reply')],
			['accept-link', Lang.get('micoformat.accept')],
			['reject-link', Lang.get('micoformat.reject')],
			['action-link', Lang.get('micoformat.action')],
			['view-link', Lang.get('micoformat.view')]
		];
		var _preload = false;
		var _imgs	= [];
		var domlist = {'corp.mail':'corp', 'mail':'mail', 'inbox':'inbox', 'bk':'bk', 'list':'list'};
		var _sEmail	= /@(ya|yandex|narod|ro|rambler|lenta|myrambler|autorambler|r0|gmail)\.\w{2,3}/i;
		var _isAva	= /(mail|inbox|corp|bk|list)\/([^\/]+)\/_avatar(small)?/i;
		var _isAbsoluteURL	= /^https?:\/\//i;
		var _protocol = location.protocol;

		// @private
		function _aLinks(msgId, msg, noReply)
		{
			var html = [], target = true, links = [], i, href;

			for( i = 0; butseq[i]; i++ ) if( href = msg[butseq[i][0]] )
				links.push([href, msg[butseq[i][0]+'-text'] || butseq[i][1]]);

			for( i = 0; i < 10; i++ ) if( href = msg['action-link'+i] )
				links.push([href, msg['action-link'+i+'-text']]);

			if( !msg.ntype || msg.ntype == 'letter' || !links.length )
			{
				if( noReply )
					links	= [['/message/' + msgId + '/', butseq[0][1]]].concat(links);
				else
					links	= [['/message/' + msgId + '/', butseq[0][1]], ['/compose/' + msgId + '/reply/', butseq[1][1]]].concat(links);

				target	= false;
			}

			for( i = 0; links[i]; i++ )
			{
				href	= (/^(http|\/)/.test(links[i][0]) ? '': 'http://') + links[i][0];
				html[i] = '<a '+(/(msglist|readmsg|sentmsg|message|compose)/.test(links[i]) ? 'rel="history"' : '')+' href="'+ href +'"'+ (target ? ' target="_blank"' : '') + ' class="' + (target ? 'new_Outer ' : '') + 'messageline__microformat__button m-btn'+ (i ? '' : '-first messageline__microformat__button_first')+ '">'+ decodeURIComponent(links[i][1]).replace(/&apos;/gi, '\'') +'</a>';
			}

			return	html;
		}

		var unescapeAdditionalHtmlSymbols = function(str)	{//TODO: remove this after MAIL-12213
			var replacer = function($0, $1, $2) {
				return this[$2] || $1;
			}.bind(this);

			return String(str || "")
				.replace(/(\&\#(037|039|92|35)\;)/g, replacer)
				.replace(/(&(apos);)/g, replacer)
			;
		}.bind({ '037': '%', '92' : '\\', '35' : '#', '039': '\'', 'apos' : '\'' });

		// @public
		var _this = {
			msg: {},

			wordWrap: mailru.newsnippets ? 70 : 0,

			preload: function (img){
			},

			/**
			 * Функция подготавливает сообщение для вывода в html. Опционально, может обрезать сообщение по максимальной
			 *  длинне и поставить в конце "..."
			 * @param {{text: string}} Msg Объект, содержащий сообщение в свойстве text
			 * @param {boolean=} wrapAndEscape Обрезать сообщение по максимальной длинне и заэскейпить html?
			 * @param {boolean=} safeString раскодируем строку через функцию decodeURIComponent и заэскейпим html в любом случае
			 * @return {String}
			 */
			text: function (Msg, wrapAndEscape, safeString){
				var txt = Msg.Microformat && Msg.Microformat['text'] || '';

				if( safeString ) {//MAIL-11566
					try {
						txt = decodeURIComponent(txt);
					}
					catch(e){}

					if( !wrapAndEscape ) { // force escaping
						txt = unescapeAdditionalHtmlSymbols(txt);//TODO: remove this after MAIL-12213

						txt = ajs.Html.escape( ajs.Html.unescape( txt.replace(/\s+/g, ' ') ) );
					}
				}

				if( wrapAndEscape && this.wordWrap > 0 ){
					txt = unescapeAdditionalHtmlSymbols(txt);//TODO: remove this after MAIL-12213

					txt = ajs.Html.escape(
						String.wordWrap(
							ajs.Html.unescape( txt )
								.replace(/\s+/g, ' ')
							, 500
							, this.wordWrap
							, '...'
							, true
						)
					);
				}

				return	txt + '&nbsp;';
			},

			links: function(Msg, mf){
				if( !(mf = Msg.Microformat) || Msg.getFolder().isSent() ) return '';
				return _aLinks(Msg.Id, mf, Msg.getFolder().isDrafts()).join('');
			},

			avatar: function (Msg, from){
				var
					  id	= Msg.Id
					, src	= this._getAvaSrc(Msg, from)
					, nsrc	= Msg.AvatarUrl
					, html	= '<i class="messageline__readStatus icon icon_read-status"><i id="nmI%s" style="display: block; width: 100%; height: 100%; background-position: center center; background-repeat: no-repeat;"></i></i>'
				;

				if( src ){
					if( _protocol == 'https:' ){
						src	= nsrc;
					}

					this.preload([id, src]);
				}

				return	html.replace('%s', id);
			},

			_getAvaSrc: function(Msg, from){
				var
					  MF = (Msg.Microformat || {})
					, isUnread = Msg.Unread
					, _img = '<i class="messageline__readStatus icon icon_read-status"><i id="nmI%s" style="display: block; width: 100%; height: 100%; background-position: center center; background-repeat: no-repeat;"></i></i>'
					, mail
					, src
					, id		= Msg.Id
					, email		= (from ? Msg.From : Msg.To)
					, ntype		= MF.ntype
					, photo		= MF.photo
					, filinN	= Number(Msg.FilinN)
					, filinEM	= Number(Msg.FilinEM)
				;

				if( ntype == "undefined" ) ntype	= !1;
				if( photo == "undefined" ) photo	= !1;


				if (_isAva.exec(photo)) {
					src	= photo + (RegExp.$3 != 'small' ? 'small' : '');
				} else {
					mail = (email+'').replace(/\.ru$/, '').split('@');
					if( !(photo && filinN) && domlist[mail[1]] ) {
						src = '//avt2.' + mailru.staticDomainName + '/' + domlist[mail[1]] + '/' + mail[0] + '/_mrimavatarsmall?specd='+ (isUnread ? 'one' : 'two');
					} else if ((photo || _sEmail.test(email)) && (filinN || filinEM)) {
						if (!(!!filinN) || _isAbsoluteURL.test(photo)) {
							if (mailru.isLocal) {
								src = '//filindev.mail.ru/pic?'+(!!filinN ? 'url='+photo : 'email='+email) +'&default=404';
							} else {
								src = '//filin'+ (filinN || filinEM)+'.' + mailru.staticDomainName + '/pic?'+(!!filinN ? 'url='+photo : 'email='+email) +'&default=404';
							}
						}
					}
				}

				return	src ? _protocol + src : src;
			},

			rbCounters: function (render, sh)
			{
				if( render )  (new Image).src = '//rs.' + mailru.SingleDomainName + '/d'+(window.MsglistExpanded ? 295418 : 295417)+'.gif?'+now();
				if( defined(sh) ) (new Image).src = '//rs.' + mailru.SingleDomainName + '/d'+(sh ? 295415 : 295416 )+'.gif?'+now();
			}
		};

		return _this;
	})();


	jsLoader.loaded('{mailru}mailru.MicroFormat', 1);

// data/ru/images/js/ru/mailru.MicroFormat.js end

// data/ru/images/js/ru/ui/mailru.ui.ClipInList.js start

/**
 * @object	mailru.ui.ClipInList
 * @author	RubaXa	<trash@rubaxa.org>
 */


// ./data/ru/fest/blocks/messagelist/messagelist__dropdown-clip.js start

;(function(){var x=Function('return this')();if(!x.fest)x.fest={};x.fest['blocks/messagelist/messagelist__dropdown-clip']=function (__fest_context){"use strict";var __fest_self=this,__fest_buf=[],__fest_chunks=[],__fest_chunk,__fest_attrs=[],__fest_select,__fest_if,__fest_iterator,__fest_to,__fest_fn,__fest_html=[],__fest_blocks={},__fest_params,__fest_element,__fest_debug_file="",__fest_debug_line="",__fest_debug_block="",__fest_htmlchars=/[&<>"]/g,__fest_htmlchars_test=/[&<>"]/,__fest_short_tags = {"area":true,"base":true,"br":true,"col":true,"command":true,"embed":true,"hr":true,"img":true,"input":true,"keygen":true,"link":true,"meta":true,"param":true,"source":true,"wbr":true},__fest_element_stack = [],__fest_htmlhash={"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"},__fest_jschars=/[\\'"\/\n\r\t\b\f<>]/g,__fest_jschars_test=/[\\'"\/\n\r\t\b\f<>]/,__fest_jshash={"\"":"\\\"","\\":"\\\\","/":"\\/","\n":"\\n","\r":"\\r","\t":"\\t","\b":"\\b","\f":"\\f","'":"\\'","<":"\\u003C",">":"\\u003E"},___fest_log_error;if(typeof __fest_error === "undefined"){___fest_log_error = (typeof console !== "undefined" && console.error) ? function(){return Function.prototype.apply.call(console.error, console, arguments)} : function(){};}else{___fest_log_error=__fest_error};function __fest_log_error(msg){___fest_log_error(msg+"\nin block \""+__fest_debug_block+"\" at line: "+__fest_debug_line+"\nfile: "+__fest_debug_file)}function __fest_replaceHTML(chr){return __fest_htmlhash[chr]}function __fest_replaceJS(chr){return __fest_jshash[chr]}function __fest_extend(dest, src){for(var i in src)if(src.hasOwnProperty(i))dest[i]=src[i];}function __fest_param(fn){fn.param=true;return fn}function __fest_call(fn, params,cp){if(cp)for(var i in params)if(typeof params[i]=="function"&&params[i].param)params[i]=params[i]();return fn.call(__fest_self,params)}function __fest_escapeJS(s){if (typeof s==="string") {if (__fest_jschars_test.test(s))return s.replace(__fest_jschars,__fest_replaceJS);} else if (typeof s==="undefined")return "";return s;}function __fest_escapeHTML(s){if (typeof s==="string") {if (__fest_htmlchars_test.test(s))return s.replace(__fest_htmlchars,__fest_replaceHTML);} else if (typeof s==="undefined")return "";return s;}var json=__fest_context;try{__fest_attrs[0]=__fest_escapeHTML(json.MailAttachPreviewHost)}catch(e){__fest_attrs[0]=""; __fest_log_error(e.message);}__fest_buf.push("<div cnt_sb=\"366559\" class=\"messagelist__dropdown\" previewUrl=\"\/\/" + __fest_attrs[0] + "\/cgi-bin\/readmsg\/\"><div class=\"messagelist__dropdown__shadow messagelist__dropdown__shadow_right\"></div><div class=\"messagelist__dropdown__shadow messagelist__dropdown__shadow_bottom\"></div><div class=\"messagelist__dropdown__clip\"><div class=\"messagelist__dropdown__clip__icon icon icon_attach\"></div></div><ul class=\"messagelist__dropdown__file-list\">");var idx,item,__fest_to0,__fest_iterator0;try{__fest_iterator0=json.Attachments || [];__fest_to0=__fest_iterator0.length;}catch(e){__fest_iterator0=[];__fest_to0=0;__fest_log_error(e.message);}for(idx=0;idx<__fest_to0;idx++){item=__fest_iterator0[idx];try{
					// a.href & a.data-href
					var _href = '//'+json.MainMailHost+'/cgi-bin/', _icon = 'Other', _type = 'Other', _isOfficePreview = false;

					if( item.isRFC822 ){
						_href = 'readmsg?id' + item.PartID
					}
					else if( item.isTNEF && !item.IsRtf ){
						_href += 'get_tnef_part?' + ajs.toQuery({
									  id: item.PartID
									, tnef_id: item.tnef_id
									, mode: 'tnef_attach'
								});
					}
					else {
						_href += 'getattach?' + ajs.toQuery({
									  id: item.PartID
									, file: item.name
									, channel: item.Channel
									, mode: 'attachment'
									, bs: item.BodyStart
									, bl: item.OriginalBodyLen
									, ct: item.ContentType
									, cn: item.ContentName
									, cte: item.ContentEncoding
								});
					}

					var
						_mime = item.ContentType,
						_ext = item.name.substr(item.name.lastIndexOf('.')+1)
					;

					// File-Icon mod
					if( item.IsMp3 ){
						_icon = 'Mp3';
					} else if( _ext == 'tar' || _ext == '7z' ||  _ext == 'gz' || _ext == 'zip' || _ext == 'rar' || _mime == 'application/zip' || _mime == 'application/x-rar-compressed' ){
						_icon = 'Arhiv';
					} else if( /image/.test(_mime) ){
						_icon = 'Picture';
					} else if( _ext == 'doc' || _ext == 'docx' ){
						_icon = 'Word';
						_type = 'Office';
					} else if( _ext == 'xls' || _ext == 'xlsx' ){
						_icon = 'Exel';
						_type = 'Office';
					} else if( _ext == 'ppt' || _ext == 'pptx' ){
						_icon = 'PowerPoint';
						_type = 'Office';
					} else if( _ext == 'txt' ){
						_icon = 'Txt';
					} else if( _ext == 'eml' ){
						_icon = 'Letter';
					} else if( _ext == 'pdf' ){
						_icon = 'Pdf';
					}

					_isOfficePreview = json.MRVOfficePreview && _type == 'Office';

				}catch(e){__fest_log_error(e.message);}__fest_buf.push("<li class=\"messagelist__dropdown__file-list__item\"><a class=\"messagelist__dropdown__file-list__item__content\" target=\"_blank\" href=\"");try{__fest_buf.push(__fest_escapeHTML((
									json.NewAttachViewer
										? '/attaches-viewer/?id='+ json.MessageId +'&_av='+ idx
										: _href
								)))}catch(e){__fest_log_error(e.message + "79");}__fest_buf.push("\" data-href=\"");try{__fest_if=_isOfficePreview}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{__fest_buf.push(__fest_escapeHTML('//docs.' + json.SingleDomainName + '/preview/206x206/?src=' + encodeURIComponent(json.httpProtocol + _href)))}catch(e){__fest_log_error(e.message + "84");}}else{try{__fest_buf.push(__fest_escapeHTML(_href))}catch(e){__fest_log_error(e.message + "87");}}__fest_buf.push("\" data-type=\"");try{__fest_buf.push(__fest_escapeHTML(_type))}catch(e){__fest_log_error(e.message + "91");}__fest_buf.push("\"><i class=\"messagelist__dropdown__file-list__item__content__file-type-icon messagelist__dropdown__file-list__item__content__file-type-icon_");try{__fest_buf.push(__fest_escapeHTML(_icon))}catch(e){__fest_log_error(e.message + "101");}__fest_buf.push(" ");try{__fest_if=_icon == 'Picture' || _isOfficePreview}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("js-attachePicture");}__fest_buf.push("\"></i><u>");try{__fest_if=item.isRFC822}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{__fest_buf.push(__fest_escapeHTML(item.Subject || 'No Subject'))}catch(e){__fest_log_error(e.message + "111");}}else{try{__fest_if=item.FileName}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{__fest_buf.push(__fest_escapeHTML(item.FileName))}catch(e){__fest_log_error(e.message + "112");}}else{try{__fest_if=item.name}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){try{__fest_buf.push(__fest_escapeHTML(item.name))}catch(e){__fest_log_error(e.message + "113");}}else{try{__fest_buf.push(__fest_escapeHTML(item.URLFileName))}catch(e){__fest_log_error(e.message + "114");}}}}__fest_buf.push("</u>&nbsp;<span class=\"messagelist__dropdown__file-list__content-size\">");try{__fest_buf.push(__fest_escapeHTML(item.size))}catch(e){__fest_log_error(e.message + "119");}__fest_buf.push(" ");try{__fest_buf.push(__fest_escapeHTML(Lang.get('Size').kb))}catch(e){__fest_log_error(e.message + "121");}__fest_buf.push("</span></a></li>");}try{__fest_if=!json.Attachments.length}catch(e){__fest_if=false;__fest_log_error(e.message);}if(__fest_if){__fest_buf.push("<li class=\"messagelist__dropdown__file-list__item\"><i class=\"messagelist__dropdown__file-list__item__content__file-type-icon messagelist__dropdown__file-list__item__content__file-type-icon_Letter\"></i><span class=\"messagelist__dropdown__file-list__content-size\">");try{__fest_buf.push(__fest_escapeHTML(Lang.str('readmsg.text').toLowerCase()))}catch(e){__fest_log_error(e.message + "131");}__fest_buf.push("&nbsp;");try{__fest_buf.push(__fest_escapeHTML(json.letter_size))}catch(e){__fest_log_error(e.message + "133");}__fest_buf.push("</span></li>");}__fest_buf.push("</ul></div>");__fest_to=__fest_chunks.length;if (__fest_to) {__fest_iterator = 0;for (;__fest_iterator<__fest_to;__fest_iterator++) {__fest_chunk=__fest_chunks[__fest_iterator];if (typeof __fest_chunk==="string") {__fest_html.push(__fest_chunk);} else {__fest_fn=__fest_blocks[__fest_chunk.name];if (__fest_fn) __fest_html.push(__fest_call(__fest_fn,__fest_chunk.params, __fest_chunk.cp));}}__fest_html.push(__fest_buf.join(""));return __fest_html.join("")} else {return __fest_buf.join("");}}; if(x.jsLoader!==undefined&&x.jsLoader.loaded!==undefined&&typeof x.jsLoader.loaded==='function'){x.jsLoader.loaded('{festTemplate}blocks/messagelist/messagelist__dropdown-clip', 1)};})();
// ./data/ru/fest/blocks/messagelist/messagelist__dropdown-clip.js end

(function (){
		var _cssAttach	= '.js-attach';

		mailru.ui.ClipInList = {
		// @private
			_id:		'0',	// current Id
			_pId:		0,	// prev Id
			_tId:		0,	// timeout id
			_items:		{},
			_bind:		0,
			_overDelay:	800,

			_loaded:	function (id, R, status){
				var I = this.get(id);

				if( (status == 'success') && (R[1] == 'OK') && (R[2] != '') ){
					var $Layer = $(R[2])
									.attr('id', I.listId)
									.attr('data-id', id)
									.addClass('js-clip-in-list-layer')
									.appendTo( mailru.View.Messages.getActive().getView() )

						, pUrl = $Layer.attr('previewUrl')
					;

					$Layer
						.find('.js-attachePicture')
						.each(function (){ new mailru.ui.ClipInList.Preview(this.parentNode, pUrl); })
					;

					I.status = 2;
					this.redraw();
				}
				else {
					I.status = 0;
				}
				$('#'+I.msgId).removeClass('iAttachLoading');
			},

			_toggle: function (id, show)
			{
				var I = this.get( id ), L, $M;

				if( I.status == 2 )
				{
					$M	= $('#'+I.msgId);
					L	= $FS('#'+I.listId);

					if( show && $M[0] )
					{
						L.display	= '';
						L.top		= $M.position().top + 'px';
						L.zIndex	= 100;
						return	true;
					}
					else
					{
						L.display	= 'none';
						return	false;
					}
				}
				return	-1;
			},

		// @public
			getId: function (){ return this._id+''; },
			get: function (id){
				if( !this._items[id] ) this._items[id] = { id: id, listId: 'ml-al'+id, msgId: id, status: 0 };
				return	this._items[id];
			},

			load: function (id){
				var I = this.get(id), msgId = id.replace(/[^\d]/g, '');

				if( !I.status ){
					I.status = 1;

					$('#'+msgId).addClass('iAttachLoading');

					var _loaded = function (){
						var Msg = mailru.Messages.get(msgId);

						this._loaded(id, [0,'OK', $.fest('blocks/messagelist/messagelist__dropdown-clip', {
							MailAttachPreviewHost: Msg.MailAttachPreviewHost,
							MainMailHost: Msg.MainMailHost,
							NewAttachViewer: mailru.NewAttachViewer,
							MessageId: Msg.Id,
							letter_size: Msg.Size,
							Attachments: Msg.Attachments || [],
							SingleDomainName: mailru.SingleDomainName,
							httpProtocol: window.location.protocol,
							MRVOfficePreview: mailru['MRVMSDocPreview'] || mailru['MRVMSPptPreview'] || mailru['MRVMSExcelPreview']
						})], 'success');
					}.bind(this);

					if( mailru.Messages.getSafe(msgId)._loaded ){
						_loaded();
					}
					else {
						mailru.Events.one('update.message.clip-in-list', function (evt){
							if( evt.DATA[0] == msgId ){
								_loaded();
							}
						});
						mailru.Messages.load(ajs.extend({ id: msgId, loading: true }, GET));
					}
				}
				return	I;
			},

			redraw: function (a){
				if( a == 'hide' ){
					this._id = '0';
				}

				if( this._pId && (this._pId !== this._id) ){
					this._toggle(this._pId, false);
				}

				if( this._id ){
					if( this._toggle(this._id, true) == false ){
						this._id = 0;
						this.redraw();
					}
					else {
						//noinspection JSValidateTypes
						this._pId	= this._id;
					}
				}

				if( this._id && !this._bind ){
					this._bind = function (evt){ !evt.isDefaultPrevented() && this.redraw('hide'); }.bind(this);
					$('body').bind('click.nsClipInList', this._bind);
				}
				else if( !this._id && this._bind ){
					this._bind = 0;
					$('body').unbind('click.nsClipInList');
				}
			},

			_mouseLeave: function (){
				if( this._id == this._leaveId ){
					this.redraw('hide');
				}
			},

			toggle: function (id){
				this.load(id);
				this._id = this._id != id ? id : 0;
				this.redraw();
			},

			wrap: function (el){
				$(el)
					.unbind('.nsClipInList')
					.delegate(_cssAttach, 'mouseover.nsClipInList', this.clearTO)
					.delegate('.js-clip-in-list-layer', 'mouseenter.nsClipInList mouseleave.nsClipInList', function (evt){
						this.clearTO();
						if( evt.type == 'mouseleave' ){
							this._leaveId = evt.currentTarget.getAttribute('data-id');
							this._tId = setTimeout(this._mouseLeave, this._overDelay);
						}
					}.bind(this))
				;
			},

			clearTO: function (){
				clearTimeout(this._tId);
			}
		};

		ajs.each(['_mouseLeave', 'clearTO'], function (name){ this[name] = this[name].bind(this); }, mailru.ui.ClipInList);
		mailru.ui.ClipInList.$Ico = jQuery(new Image).attr('src', '//img.' + mailru.staticDomainName + '/r/default/loader.gif');
		// mailru.ui.ClipInList


		/**
		 * @class	mailru.ui.ClipInList.Preview
		 */
		jsClass
			.create('mailru.ui.ClipInList.Preview')
			.statics({ zIndex: 900 })
			.methods({

			__construct: function (File, pUrl){
				var data = ajs.extend(ajs.toObject($(File).data("href")), { af_preview: 1 }),
					type = $(File).data('type');

				if (type == 'Office') {
					this.file = $(File).data('href');
				}
				else {
					this.file= pUrl + data.file +'?'+ ajs.toQuery(data);
				}

				this.$Box = jQuery('<div></div>')
								.append( mailru.ui.ClipInList.$Ico.clone() )
								.css({
									  position:		'absolute'
									, display:		'none'
									, background:	'#fff'
									, padding:		'8px 4px'
									, width:		this.w = 16
									, height:		this.h = 7
									, top:			-4
									, left:			(this.left = -24)
									, opacity:		0
									, overflow:		'hidden'
								})
								.css3({ borderRadius: 5, boxShadow: '0px 0px 5px #000' })
								.prependTo( File )
							;

				if( ($B.msie && $B.ver < 9) || ($B.opera && $B.ver < 10) )
				{
					this.$Box.css({ border: '1px solid #000' });
				}

				jQuery(File).hover($D(this, '_show'), $D(this, '_hide')).css({ position: 'relative' });
			},

			_ready: function ()
			{
				if( !this.loaded )
				{
					this.w = this.$Img[0].width;
					this.h = this.$Img[0].height;

					this.$Box.empty().append( this.$Img.css({ top: '50%', left: '50%', marginLeft: -this.w/2, marginTop: -this.h/2 }) );

					this.left	= -this.w - 8;
					this.loaded = true;

					this.$Box
						.click($D(this, '_fullScreen'))
						[this.visible ? 'animate' : 'css']({
							  left:		this.left - 15
							, top:		-this.h/2
							, width:	this.w
							, height:	this.h
						}, 'fast');
				}
			},

			_show: function ()
			{
				if( !this.$Img ) this.$Img = jQuery(new Image).load($D(this, '_ready')).attr('src', this.file).css({ position: 'relative' });

				this.visible	= 1;

				//noinspection JSUnresolvedVariable
				this.$Box.stop(true)
					.css({ zIndex: ++mailru.ui.ClipInList.Preview.zIndex, display: '' })
					.animate({
						  left:		this.left
						, top:		-this.h/2
						, opacity:	1
						, width:	this.w
						, height:	this.h
					}, 'fast')
				;
			},

			_hide: function ()
			{
				if( this.visible === 1 )
				{
					this.visible	= 0;

					//noinspection JSUnresolvedVariable
					this.$Box.stop(true)
						.css('zIndex', --mailru.ui.ClipInList.Preview.zIndex)
						.animate({
							  left:		this.left - 15
							, top:		-this.h/2
							, opacity:	0
							, width:	this.w
							, height:	this.h
						}, 'fast', function (){ $FS(this).display = 'none'; })
					;
				}
			},

			_fullScreen: function (evt)
			{
				if( this.Layer )
				{	// Destroy
					this.Layer.$Box.remove();
					this.Layer.destroy();
				}

				$R('{plugins}LightBox', $D(this, function ()
				{
					var src		= this.file.replace('af_preview=1', '');
					var parent	= $('#ScrollBodyInner')[0] || document.body;
					var $Layer	= $('<div></div>')
									.css3({ borderRadius: 10, boxShadow: '0 0 15px #000' })
									.css({ background: '#fff', padding: 10, overflow: 'hidden', width: this.w, height: this.h })
									.append( this.$Img.clone() )
									.appendTo( parent )
									.click(function (){ this.Layer.hide() }.bind(this))
								;

					this.Layer	= new LightBox( $Layer, {
									  visible:		1
									, hideByFade:	'click'
									, BODY:			parent
									, scrollWidth:	$('#ScrollBody').width() - $('#ScrollBodyInner').width()
								});

					$(new Image).load(function (evt){
						var
							  $Big = $(evt.currentTarget)
							, w = $Big.attr('width')
							, h = $Big.attr('height')
							, sW = Math.min(w, ajs.windowWidth() - 70)
							, sH = Math.min(h, ajs.windowHeight() - 60)
						;

						if( w > sW ){
							h   = sW*(h/w);
							w   = sW;
						}

						if( h > sH ){
							w   = sH*(w/h);
							h   = sH;
						}

						this.Layer.$Box.empty().append( $Big.css({ width: w, height: h }) ).find('img').css({
							  marginLeft:	-w/2
							, marginTop:	-h/2
							, left:			'50%'
							, top:			'50%'
							, position:		'relative'
						});
						try { this.Layer.resize(w, h, 0, 'fast'); } catch (e){}
					}.bind(this)).attr('src', src);

				}));

				$(evt.target).closest('A').blur();

				return	false;
			}

		});
	})();


	jsLoader.loaded('{mailru.ui}mailru.ui.ClipInList', 1);

// data/ru/images/js/ru/ui/mailru.ui.ClipInList.js end

/**
	 * @class mailru.View.Messages
	 */
	jsView
		.create('mailru.View.Messages')
		.statics({

			getActive: function () {
				var id = 'folder.messages';
				if (mailru.isSearchPage()) {
					id = 'search.messages';
				} else if (mailru.isFileSearchPage()) {
					id = 'fileSearch.messages';
				}
				return jsView.get(id);
			}

		})
		.methods({

		_first: mailru.v2 ? ajs.F : function (){
			var self = this,  fId = GET.folder, sort = mailru.messagesSort;

			this._scbx			= {};
			this.isShort		= !mailru.MsglistExpanded;

			this.$View			= $(this.cssList);
			this.idRoot			= this.idRoot || this.idView;
			this.idMsgPrefixLen	= this.idMsgPrefix.length;

			if( this.template ){
				// preload current template
				$.preloadTpl(this.template);
			}

			TemplateParser.add(this.uniqId+'MsgParser', {
				  MsgId:		function(m) { return m.Id; }
				, MsgFolderId:	function(m) { return mailru.isFilterFolder() ? GET.folder : m.FolderId; }
				, MsgLine:		function(m) { return (self._scbx[m.Id] ? self.clMsgSel+' ' : '')+(m.Unread >>> 0 ? self.clMsgUnread+' ' : '')+(mailru.ui.ClipInList.getId() == m.Id ? 'iAttachExpand ' : ''); }
				, MsgChecked:	function(m) { var c = (self._scbx[m.Id] ? 1 : 0); return (c ? 'checked="true"' : '') + ' title="'+ Lang.get('MessagesCheckBoxTitle')[c] +'"'; }
				, MsgIco:		function(m) { return m.getIcon(); }
				, MsgFlIco:		function(m) { return m.isUnread() && (m.get('FromFull') == 'cards@corp.mail.ru' ? 'fl' : 0) || ''; }
				, MsgTitle:		function(m) {
					var title = '';
					if (m.isUnread()) title += Lang.get('Message').unread;
					if (m.isReply()) title += Lang.get('Message').replied;
					if (m.isForward()) title += Lang.get('Message').forwarded;
					if (!title) title = Lang.get('MessagesMarkUnread');
					return String.ucfirst(title);
				}
				, MsgAttach:	function(m) { return m.Attachment ? self.clMsgAttach : ''; }
				, MsgAttachSize:function(m) { return m.Attachment ? 'title="'+m.Size+'"' : ''; }
				, MsgHref:		function(m) { return mailru.getPageURL(!m.inFolder(mailru.Folder.DRAFTS) ? 'readmsg' : 'compose', { id: m.id, mode: 'drafts' }); }
				, MsgFrom:		function(m) { return ((m.inFolder(mailru.Folder.SENT) || m.inFolder(mailru.Folder.DRAFTS)) ? m.ToShort : m.FromShort) || ('<' + Lang.get('message.email.unknown') + '>'); }
				, UserEmail:    function(m) { return this.MsgFromFull(m); }
				, UserEmailText:    function(m) { return String.html2text(this.UserEmail(m)); }
				, MsgFromFull:	function(m) { return ((m.inFolder(mailru.Folder.SENT) || m.inFolder(mailru.Folder.DRAFTS)) ? m.To : m.From) || ('<' + Lang.get('message.email.unknown') + '>'); }
				, MsgSubject:	function(m) { return mailru.isFilterFolder() ? m.getSearchSubject() : m.getSubject(); }
				, MsgSubjectText:	function(m) { return String.html2text(this.MsgSubject(m)); }
				, MsgWbrSubject:	function(m) { return m.getWbrSubject(); }
				, MsgSubjectIco:function(m) { return ( m.isHigh() || m.isLow() ) ? '<i title="'+String.ucfirst((m.isHigh() ? Lang.get('Message').high_priority : (m.isLow() ? Lang.get('Message').low_priority : '')))+'" class="messageline__icon-priority icon icon_priority icon_priority_'+(m.isHigh() ? 'high' : (m.isLow() ? 'low' : '')) + (m.isUnread() ? '-unread' : '')+'"></i>' : ''; }
				, MsgDateTitle:	function(m) { return m.Date; }
				, MsgDate:		function(m) { return m.DateShort; }
				, MsgSize:		function(m) { return m.Size; }
				, IcoFromWho:	function(m) { return m.IcoFromWho ? ' style="background-image: url(//img.mail.ru/mail/ru/images/default/ico-from/12' + m.IcoFromWho + '.png);" class="'+self.clMsgIco+'"' : 'class="'+self.clMsgIcoNo+'"'; }
				, history:			function(m){ return 'rel="history"'; }
				, MsgFlagClass:		function(m){ return m.isFlagged() ? ' '+self.clMsgFlagged+' ' : ' '; }
				, MsgFlagTitle:		function(m){ return Lang.get('MessagesFlags')[+m.isFlagged()]; }
				, MsgMsgText:		function(m){ return mailru.newsnippets || !self.isShort ? mailru.MicroFormat.text(m, self.isShort) : ''; }
				, MsgFolderName:	function(m){ return m.getFolder().Name; }
				, MsgSnipletText:	function(m){ return m.getSnipletText(); }
				, MsgMakeAvatar:	function(m){ return self.isShort ? '' : mailru.MicroFormat.avatar(m, !m.inFolder(mailru.Folder.SENT)); }
				, MsgMakeButtons:	function(m){ return self.isShort ? '' : mailru.MicroFormat.links(m); }

				, MsgSearchHref:	function(m) {
					return m.inFolder(mailru.Folder.DRAFTS)
						? mailru.getPageURL('compose', { id: m.id, mode: 'drafts' })
						: mailru.getPageURL('readmsg', { id: m.id }) + '?fromsearch=search'+replaceEntity(mailru.SearchData.search.URLQ)
					;
				}
				, MsgSearchSnippet:	function(m){ return m.getSearchSniplet(); }
				, MsgSearchSubject:	function(m){ return m.getSearchSubject(); }
				, MsgSearchFrom:	function(m){ return m.getSearchFrom(); }

				, FileId:	function(f) { return f.Id; }
				, FileFolderId:	function(f) { return f.folder_id; }
                , FileFolderHref : function(f) {
                    var url = '/messages', id = f.folder_id;
                    switch (parseInt(id,10)) {
                        case 0      : url += '/inbox'; break;
                        case 950    : url += '/spam'; break;
                        case 500000 : url += '/sent'; break;
                        case 500001 : url += '/drafts'; break;
                        case 500002 : url += '/trash'; break;
                        case 500003 :
                        case 500005 : url = '/agent/archive'; break;
                        default     : url += '/folder/' + id;
                    }
                     return url;
                }
				, FileSize:	function(f) { return String.sizeFormat(f.size); }
				, FileSubject:  function(f) {
					return	String.html2text(mailru.Utils.FileSearch.getSubject(f));
				}

				, FileFolderName:	function(f) {
					var folder = mailru.Folders.get(f.folder_id);
					return folder ? String.html2text(folder.Name) : '';
				}
				, FileTime:	function(f) {
					return	mailru.Utils.FileSearch.getTime(f);
				}
				, FilePreviewHref:	function(f) {
					return	mailru.Utils.FileSearch.getPreviewHref(f);
				}
				, FileName:	function(f) {
					return String.html2text(f.name || ('<' + Lang.get('message.email.unknown') + '>'));
				}
				, FileFromEmail:	function(f) {
					return String.html2text(f.from_to_email || ('<' + Lang.get('message.email.unknown') + '>'));
				}
				, FileFrom:	function(f) {
					return String.html2text((mailru.FilesSearchData.version ? (f.from_to_name || f.from_to_email) : (f.from_to)) || ('<' + Lang.get('message.email.unknown') + '>'));
				}
				, FileMsgHref:	function(f) {
					return '/message/' + f.id + '/?folder=' + f.folder_id;
				}
				, FileStatus: function(f) {
					var fid = f.folder_id, status = 0;
					if (fid == 500000) {
						status = 510;
					} else if (fid < 500000) {
						status = 501;
					}
					return status;
				}
				, FileDownloadHref:	function(f) {
					return mailru.Utils.FileSearch.getDownloadUrl(f.Id, f.name);
				}
				, FileExtention: function(f) {
					return String.html2text(mailru.Utils.FileSearch.getFileExtention(f));
				}
				, FileThumbnail: function(f) {
					return mailru.Utils.FileSearch.getThumbnailSrc(f);
				}
				, FileType: function(f) {
					var type_id = f.content_type_id, ext = this.FileExtention(f), result = ext;
					if (type_id == 1) {
						result = 'picture';
					} else if (type_id == 2) {
						result = 'mp3';
					}
					return 'icon_filetype_' + result;
				},


				// thread
				threadLength: function (m){ return m.threadLength }
			});

			if( mailru.isMsgList ){
				this.isChange('id', fId);
			}

			this.isChange('hSort', sort+fId);
			this.isChange('sort', sort);
			this.isChange('page'+fId, GET.page);
			this.isChange('pageLoad', GET.page);

			if( mailru.isMsgListPage() ){
				fId = this.getFolder().Id;
				this.isChange('hash'+fId, mailru.Messages.getHash(fId) || mailru.CurrentTimestamp);
			}


			// Message updated
			(function (){
				mailru.Events.bind('updated.message', function (evt){
					var msg = evt.DATA, $el = $('#' + this.idMsgPrefix + msg.Id.replace(/(:|;|\.)/g, '\\$1')), c = msg.getChanges();

					if( $el.size() ){
						var u = ('Unread' in c), fl = ('Flagged' in c), r = ('Reply' in c), fw = ('Forward' in c);
						if( u || fl || r || fw ){
							this.upd((fl ? msg.Flagged : undef), ((u || r || fw) ? msg.Unread : undef), $el);
						}
					}
				}.bind(this));
			}).gap(this)();

			this._iForwardRemoveSpam();
		},

		_one: function (){
			this.fID				= !mailru.isFilterFolder() && mailru.folderId;
			this._scbx				= {};	// selected checkbox

			this.$List				= $( this.cssList );
			this.$Switch			= this.clViewType ? $('.'+this.clViewType, this.idRoot) : $();
			this.$ExpandedSwitch	= this.clExpandedSwitcher ? $('.'+this.clExpandedSwitcher, this.idRoot) : $();
			this.$ToolBar			= $( this.cssToolBar, this.idRoot );
			this.$Sort				= $( this.cssSort, this.idRoot );
			this.$All				= $('input[name="mainCheck"]', this.idRoot);
			this.$prevListContainer	= this._getContainer();

			this.Tpl		= new Template(this.uniqId, $F('#' + this.tplId), 'text/plain');
			this.Tpl.parser( this.uniqId+'MsgParser' );

			if (this.tplExpandedId) {
				this.TplExpanded = new Template(this.uniqId + 'expanded', $F('#' + this.tplExpandedId), 'text/plain');
				this.TplExpanded.parser( this.uniqId + 'MsgParser' );
			}

			this._iActions();
			mailru.ui.ClipInList.wrap( this.getView() );
		},

		_iForwardRemoveSpam: function (){
			$('.js-reply,.js-replyall,.url-forward,.js-remove,.js-spam,.js-fileDownload,.js-fileForward,.js-fileInArchive,.js-fileFromArchive, .js-it-spam-definitely', this.idRoot).click(function (evt){
				var $Btn = $(this);

				if ($Btn.hasClass('button-a_disabled')) {
					evt.stopPropagation();
					evt.preventDefault();

				} else if (!($Btn.hasClass('js-reply') || $Btn.hasClass('js-replyall') || $Btn.hasClass('url-forward'))) {
					if( $Btn.hasClass('js-spam') ){
						var F = mailru.Folders.getSafe();	// get current folder
						var type = F.isBulk() ? 'notspam' : 'spamabuse';
						mailru.Events.fire('spam.click', type);

						if (mailru.isReadMsg) {
							if (type == 'notspam') {
								$(window).triggerHandler('nospamLinkClick.readmsg');
							} else {
								$(window).triggerHandler('spamLinkClick.readmsg');
							}
						}

					} else if( $Btn.hasClass('js-it-spam-definitely') ){
						mailru.Events.fire('spam.click', 'spam.definitely');
						//Counter.sb(?????);

					} else if( $Btn.hasClass('js-fileDownload') ){
						mailru.Events.fire('fileDownload.click');
						Counter.sb(716195);

					} else if( $Btn.hasClass('js-fileForward') ){
						mailru.Events.fire('fileForward.click');
						Counter.sb(716196);

					} else if( $Btn.hasClass('js-fileInArchive') ){
						mailru.Events.fire('fileInArchive.click');
						Counter.sb(716197);

					} else if( $Btn.hasClass('js-fileFromArchive') ){
						mailru.Events.fire('fileFromArchive.click');
						Counter.sb(716198);

					} else {
						mailru.Events.fire('move.click', mailru.Folder.TRASH);
					}

					evt.preventDefault();
				}
			});
		},

		_iActions: function (){
			var sm = this.switchMode;

			this.$ExpandedSwitch.click(function (){ this._modeExpanded(); return false; }.bind(this));

			if (sm) {
				this.$Switch.click(function (evt) {
					var $target = $(evt.target).closest('.dropdown__list__item__link', this.$Switch);
					var compact = $target.is(sm.cssShort);
					if (compact != this.isShort) {
						if (mailru.MessagelineMedia_split_bubble) {
							if (compact) {
								mailru.radar('MessageLineWithBal', 'compactClick=1');
							} else {
								mailru.radar('MessageLineWithBal', 'expandClick=1');
							}
						} else {
							if (compact) {
								mailru.radar('MessageLine', 'compactClick=1');
							} else {
								mailru.radar('MessageLine', 'expandClick=1');
							}
						}
						this._mode(compact, true);
					}
				}.bind(this));

				if( mailru.Messages.isShort === ajs.undef ){
					mailru.Messages.isShort = !!this.$Switch.find(sm.cssShort +'.'+ sm.cnActive).size();
				}
				this.isShort = mailru.Messages.isShort;
			}

			var rFlagAttach = new RegExp('flag|atta?ch|'+this.clIcoUnread+'|'+this.clIcoRead, 'i');

			this.$List
				.bind('select dragstart', function (evt){ evt.preventDefault(); })
				.mouseover(this._onOverList.bind(this))
				.mousedown(this._drag.bind(this))
				.click(function (evt){
					if (this.id == 'fileSearch.messages' && mailru.FileSearchWithThumbnail && !mailru.MailFilesViewStyle) {
						var
							  $target = $(evt.target)
							, $item = $target.closest('.' + this.clExpandedThumbnail, this.$List)
							, $download = $target.closest('.' + this.clExpandedThumbnailDownloadLink, $item)
							, $checkbox = $target.closest('.' + this.clExpandedThumbnailCheckboxLabel, $item)
							, $subject = $target.closest('.' + this.clExpandedThumbnailBody, $item)
						;

						if ($item.length) {
							if ($checkbox.length) {
								this._checked($target, evt.shiftKey);
							}
							else if (!$download.length && !$subject.length) {
								mailru.Utils.FileSearch.openViewer($item.attr('data-id'));
								evt.preventDefault();
								evt.stopPropagation();
							}
						}
					} else {
						if( this._dM && this._dM.hasClass(this.clDisabled) ){
							evt.preventDefault();
							return;
						}

						var $E = $($G(evt)), ret = true, tag = $E[0].tagName.toUpperCase();

						if( !evt.shiftKey && tag == 'LABEL' ){
							return;
						}

						if( $E.hasClass('msg-L') || tag == 'LABEL' ){
							$E = $E.find('INPUT');
							$E[0].checked = !$E[0].checked;
						}

						tag	= $E[0].tagName.toUpperCase();

						// < IF
						if(
						   (tag !== 'A') && !$E.hasClass(this.clMsg)
						&& (
							   rFlagAttach.test($E[0].className)
							|| (tag == 'INPUT')
							|| ($E = $E.find('.js-flag-icon,.js-attach-icon')).length
						   )
						){
							tag		= $E[0].tagName.toUpperCase();
							var id	= this._dID;

							if( tag == 'INPUT' ){
								this._checked( $E, evt.shiftKey );
							}
							else if( $E.hasClass(this.clIcoRead) ){
								mailru.Messages.edit('mark', id, mailru.Message.UNREAD);
								mailru.Messages.get(id).set({ Unread: 1 });
							}
							else if( $E.hasClass(this.clIcoUnread) ){
								mailru.Messages.edit('mark', id, mailru.Message.READ);
								mailru.Messages.get(id).set({ Unread: 0 });
							}
							else if( $E.hasClass('js-attach-icon') || $E.parent().hasClass('js-attach') ){
								ret	= false;
								mailru.ui.ClipInList.toggle( this.idMsgPrefix + id );
								$(window).triggerHandler('attachLinkClick.msglist');
							}
							else if( $E.hasClass('js-flag-icon') ){
								var flag = !$E.hasClass(this.clMsgFlagged);
								mailru.Messages.edit('mark', id, mailru.Message[flag ? 'FLAG' : 'NOFLAG']);
								mailru.Messages.get(id).set({ Flagged: +flag });
							}


						}
						// IF >

						if( jsHistory.disabled ) setTimeout(function (){
							try { if( document.selection && document.selection.empty ) document.selection.empty(); } catch (e){}
							jsHistory.disabled = false;
						}, 1);

						if( !ret ){
							evt.preventDefault();
						}
					}
				}.bind(this))
			;

			if( !this.$List.attr("data-create-time") ) {// MAIL-13870
				this.$List.attr("data-create-time", Date.now());
			}

			this.$List.mousedown(function(evt){// MAIL-13870
				if( mailru.isSearchPage() ) {
					var searchResultCreatedTime = this.$List.attr("data-create-time");
					var $target = $(evt.target);
					var link = $target.closest("." + this.clMessageLink, evt.currentTarget);

					if( Number.isNumeric(searchResultCreatedTime) && link.length ) {
						var linkHref = link.attr("href")
							, _time = Date.now() - +searchResultCreatedTime
						;
						if( linkHref.contains("from_search=") ) {
							linkHref = linkHref.replace(/from_search=\d+/, "from_search=" + _time);
						}
						else {
							linkHref += (linkHref.contains("?") ? "&" : "?") + "from_search=" + _time
						}
						link.attr("href", linkHref);
					}
				}
			}.bind(this));

			// Select All
			this.$All.click(function (evt){
				evt.stopPropagation(); // Да простит меня господь!
				this.select(evt.target.checked, true);
			}.bind(this));
		},


		_onOverList: function (evt){
			if( false && mailru.isMsgList ){
				var node = evt.target, cn;
				if (node) {
					do {
						cn = ' '+node.className+' ';

						if( ~cn.indexOf(' '+this.clMsgUnread+' ') ){
							// This messages in unread, get message by id
							var M = mailru.Messages.getSafe(node.id.replace(this.idMsgPrefix, ''));
							if( M.isUnread() && !M.isLoaded() ){
								mailru.Messages.load({ folder: (M.FolderId || GET.Folder), id: M.Id });
							}
						}

						node = node.parentNode;
					} while( cn.indexOf(' js-msg ') === -1 );
				}
			}
		},

		_modeExpanded: function () {
			var isCollapsed = mailru.MailFilesViewStyle = !mailru.MailFilesViewStyle;

			this.$List.toggleClass(this.clExpandedList, !isCollapsed);
			this.$ExpandedSwitch.toggleClass(this.clExpandedSwitcherShort, isCollapsed);

			mailru.Ajax({
				type: 'POST',
				url: '/cgi-bin/ajax_modifyprofile?ajax_call=1&func_name=' + (isCollapsed ? 'mail_files_viewer_on' : 'mail_files_viewer_off')
			});
			this._list();
		},

		_mode: function (short, save){

			var s = ajs.isset(short, !this.isShort), changed = this.isShort != s;

			mailru.Messages.isShort = this.isShort = s;

			if (this.clListShort) {
				this.$List.toggleClass(this.clListShort, s);
			}

			if (this.clListMicroformat) {
				this.$List.toggleClass(this.clListMicroformat, !s);
			}

			if (this.clSwitchShort) {
				this.$Switch.toggleClass(this.clSwitchShort, s);
			}

			var sm = this.switchMode;

			this.$Switch
				.find('.'+sm.cnActive).removeClass(sm.cnActive).end()
				.find(s ? sm.cssShort : sm.cssFull).addClass(sm.cnActive).end()
			;

			if (changed) {
				mailru.Messages.isShort = this.isShort = s;
				this._list();
			}

//			this._checkView(undef, mailru.newsnippets);

			if( save || !arguments.length ){
				mailru.Messages.saveCompactViewState(s);
			}
		},

		_getContainer: function () {
			var id = this.getListId(), $box = $(document.getElementById(id));

			if( !$box.length && this.$List ){
				$box = $('<div class="js-msg-list"></div>').attr({ id: id, 'short': this.isShort ? 'Y' : 'N' });
				this.$List.append( $box );
			}

			return $box;
		},

		_checkView: function ($S, force){
			var fId = this.getFolder().Id;

			if( !$S ){
				$S = this._getContainer();
			}

			if( force || (!this.isShort && $S.attr('short') == 'Y') ){
				$S.attr('short', 'N');
				this.isChange('hash'+fId, undef);
				this.redraw();
			}

			return	$S;
		},

		_checked: function ($L, shift){
			var C = $L[0].tagName == 'INPUT' ? $L[0] : $L.find('INPUT')[0], id = C.value;
			this.select(C.checked, id, shift && this._cbx !== id ? this._cbx : 0);
			this._cbx	= id;
		},

		_drag: function (evt){
			if( !(this.isLeftClick = jsEvent.Mouse.isLeft(evt)) ) return;

			var type = evt.type, up = (type == 'mouseup');

			if( (type === 'mousedown') || up ){ // mousedown OR mouseup
				evt.preventDefault();


				if( up ){ // Mouse up
					if( this._d ){
						if( this._dF ){
							this._d$.display(0);
							var mId = this._dID, fId = this._dF.id.substr(6);
							setTimeout(function (){ mailru.Messages.edit('move', mId, fId); }, 1);
						}
						else {
							this._d$.animate({ left: this._dX, top: this._dY, opacity: 'hide' }, 'slow', 'easeOutExpo');
						}

						this._d	= 0;

						$('body').removeClass('grabbing');
						$('#foldersStartId .'+this.clFolderHover).removeClass(this.clFolderHover);
						this._$dF.unbind('mouseenter mouseleave', $DS(this, '_hoverFolder'));
					}
				}
				else {
					// Mouse down
					this._dF	= 0;
					this._dM	= $(evt.target).closest('.'+this.clMsg);

					if( this._dM[0] ){
						this._dID	= this._dM[0].id.substr(this.idMsgPrefixLen);
						this._dX 	= evt.pageX;
						this._dY 	= evt.pageY;
					}
				}

				if( this._dI === undef ){
					this._d$ = $('<div id="msgDragId"></div>')
						.css({
							'position':		'absolute',
							'zIndex':		1000,
							'background':	'#AAA',
							'color':		'#333',
							'padding':		'3px 10px',
							'font':			'95% Tahoma',
							'whiteSpace':	'nowrap',
							'left':			this._dX,
							'top':			this._dY,
							'display':		'none'
						})
						.appendTo('BODY')
					;

					this._dI = this._d$[0].style;
				}

				if( this.dragdrop && this._dM && !this._dM.hasClass(this.clDisabled) ){
					// Disable updater for Drag'n'Drop
					mailru.log('msglist.dragndrop', up);
					mailru.Updater[up ? 'start' : 'stop']();
					$(document)[up ? 'unbind' : 'bind']('mouseup mousemove', $DS(this, '_drag'));
				}

				if( up ){
					setTimeout(function (){
						$('.theme').unbind('click.msgdrag');
						$('#foldersStartId').unbind('click', ajs.retFalse);
					}, 5);
				}
			}
			else {
				// MouseMove
				var dx = evt.pageX - this._dX, dy = evt.pageY - this._dY;

				if( (this._d !== 1) && (Math.abs(dx) > 10 || Math.abs(dy) > 10) ){
					this._d	= 1;

					$('body').addClass('grabbing');
					$('.theme').one('click.msgdrag', ajs.retFalse);

					$('#foldersStartId').click(ajs.retFalse);

					// @todo refactoring msglist drag'n'drop
					var cl = 'menu__item__link_act';

					this._$dF	= $('.js-folder:not(.' + cl + ')', '#foldersStartId').bind('mouseenter mouseleave', $DS(this, '_hoverFolder'));
					this._dID	= this.select(true, this._dID);
					this._d$.stop().html( String.num(this._dID.length, Lang.get('Messages').letter, ' ')).css({ opacity: 1, display: '' });
				}

				if( this._d === 1 ){
					this._dI.top	= (this._dY + dy + 6) + 'px';
					this._dI.left	= (this._dX + dx + 6) + 'px';
				}
			}
		},

		_hoverFolder: function (evt){
			var h = evt.type == 'mouseenter';
			$(evt.currentTarget).toggleClass(this.clFolderHover, h);
			this._dF = h ? evt.currentTarget : 0;
		},

		_sort: function (sortBy, id){
			var F = mailru.Folders.getSafe(id), isToFolder = F && (F.isSent() || F.isDrafts());

			sortBy = sortBy || mailru.messagesSort || 'D';

			mailru.messagesSort =
			mailru.Messages.sort = sortBy;

			if( sortBy == 't' ){
				sortBy = 'f';
			}
			else if( sortBy == 'T' ){
				sortBy = 'F';
			}

			this.$Sort
				.find('A')
					.each(function (){
						this.href = this.href.replace(/^[^?]+/, F.getUrl());
					})
					.filter('.dropdown__list__item__link_selected')
						.removeClass('dropdown__list__item__link_selected')
						.end()
					.filter('[href*="sortby=' + sortBy + '"]')
						.addClass('dropdown__list__item__link_selected')
						.end()
					.find('[class^="sort-"]')
						.display(0)
						.filter('[class="sort-' + (isToFolder ? 'to' : 'from') + '-txt"]')
							.display(1)
			;
		},

	// @public
		select: function (c, a, b)
		{
			if( mailru.isReadMsg ) {
				var Message = mailru.Messages.get(GET.id);

				return [Message.id || GET.id];
			}

			var filter = ajs.retTrue,
				expanded = (this.id == 'fileSearch.messages' && mailru.FileSearchWithThumbnail && !mailru.MailFilesViewStyle);

			if( typeof c == 'string' )
			{
				var t = c;
				c =
				a = true;

				if( t == 'none' )
				{	// Deselect
					c = false;
				}
				else if( t != 'all' )
				{
					var
						  F		= this.getFolder()
						, email	= F && (F.isSent() || F.isDrafts()) ? 'To' : 'From'
						, arEmail
					;

					if( t == 'email' )
					{
						arEmail	= Array.uniq(mailru.Messages.map(this.select(), function (M) {
							return (M[email] || '').toLowerCase();
						}));
					}

					filter = function (id, N)
					{
						var M = mailru.Messages.get(id);

						if( !M )
						{
							N = $(N);
							M = { Unread: N.hasClass(this.clMsgUnread), Flagged: N.hasClass(this.clMsgFlagged) };
						}

						if( t == 'email' )
						{
							return Array.indexOf(arEmail, M[email].toLowerCase()) > -1;
						}

						return (
							   (t === 'unread' && M.Unread )
							|| (t === 'readed' && !M.Unread )
							|| (t === 'flagged' && M.Flagged )
							|| (t === 'unflagged' && !M.Flagged )
							|| (t === 'attach' && M.Attachment )
						);
					};
				}
			}

			var $container = this._getContainer();

			if( a && this.getMessages().length )
			{
				var Node = $container[0], id, ok = 0, cbx, clSel = this.clMsgSel;

				if( Node && (Node = Node.firstChild) ) do
				{
					if( Node.nodeType == 1 )
					{
						id	= Node.id.substr(this.idMsgPrefixLen); // first

						if( a === true ) ok = 1;
						else if( !b ) { ok = 2; if( (Node = $F('#'+ this.idMsgPrefix + a)).nodeType !== 1 ) break; }
						else if( id == a || id == b ) ok++;

						id	= Node.id.substr(this.idMsgPrefixLen);	// second

						if( ok > 0 )
						{
							var _c = filter(id, Node) ? c : false;
							this._scbx[id]	= _c;

							if (!expanded) {
								if( _c && Node.className.indexOf(clSel) == -1 ) Node.className += ' '+clSel;
								else if( !_c ) $RA(Node, 'className', ' '+clSel, '');
							}

							cbx = Node.getElementsByTagName('INPUT')[0];
							if( cbx !== undef )
							{
								cbx.checked	= _c;
								cbx.title	= Lang.get('MessagesCheckBoxTitle')[+c];
							}

							if( ok == 2 ) break;
						}
					}
				}
				while( Node = Node.nextSibling );
			}

			var $X		= this.$CurSelCBX = $(':checked', $container);
			var count	= $X.length;

			c = count ? (count == this.getMessagesOnPage())+1 : 0;

			if( this.isChange('a-cbx', c) && this.$All )
			{
				this.$All
					.css({ opacity: (!c || c == 2) ? 1 : .5 })
					.attr({ checked: !!c, title: Lang.get('MessagesSelectAllTitle')[c?1:0] })
				;
			}

			return Array.map($X, function (C){ return C.value; });
		},

		_redraw: function (r, a){
			if( r ){
				var
					  fID	= this.getFolder().Id
					, page	= this.getCurrentPage()
					, hash	= mailru.Messages.getHash(fID)
				;

				if( this.isChange('id', fID) ){
					this.show();
				}

				if( this.isChange('id-page', fID+''+page) ){
					this.$P('id-page');
					var
						  $Back = (this.__$Back = this.__$Back || this.getForm().find('input[name="back"]'))
						, val = $Back.val()
					;

					if( val ){
						$Back.val( val.replace(/\?.+/, '?')+ajs.toQuery(GET) );
					}

					this.$P('id-page', 1);
				}

				if( hash !== undef && this.isChange('hash'+fID, hash) ){
					if( mailru.isSearchPage() ) {// MAIL-13870
						this.$List.attr("data-create-time", Date.now());
					}

					this.$P('_list');
					this._list();
					this.$P('_list', 1);

					this.$P('show');
					this.show();
					this.$P('show', 1);
				}

				this.$P('_sort');
				this._sort( mailru.messagesSort, fID );
				this.$P('_sort', 1);

				if( this.isChange('url', jsHistory.get()) ) setTimeout(function (){
					$(window).triggerHandler('show.msglist', [mailru.Pager.page]);
				}, 1);
			}
			else if( !r ){
				if( a ){
					$('#mailruPreFoot').display(1);
					this.statusLine('count');
					this.isChange('pageLoad', GET.page);
					if (this.clListShort && this.clSwitchShort) {
						this._mode(mailru.Messages.isShort);
					}
				} else {
					this.isChange('url', null);
				}
			}
		},

		_list: function (){
			var
				  folder = mailru.getFolderId()
				, array = this.getMessages()
				, expanded = (this.id == 'fileSearch.messages' && mailru.FileSearchWithThumbnail && !mailru.MailFilesViewStyle)
				, result_html = ''
			;

			if (!array.length) {
				var query_data =  {
					'q_query' : defined(GET.q_query)  ? String.html2text(GET.q_query).replace(/\+/g, " ") : '',
					'q_read'  : defined(GET.q_read)   ? String.html2text(GET.q_read)   : '',
					'q_folder': defined(GET.q_folder) ? String.html2text(GET.q_folder) : '',
					'ddb'     : defined(GET.ddb)      ? String.html2text(GET.ddb)      : ''
				};

				if (GET.page > 1) {
					jsHistory.build({ page: 1 }, ['page']);
					this._getContainer().innerHTML('');
				}
				if (this.isEmptyCollector && mailru.isEmptyCollectorFolder()) {
					this._getContainer().tpl(this.isEmptyCollector, query_data);
					Counter.d(1675338);
				}
				else if (this.idEmptyView) {
					this._getContainer().tpl(this.idEmptyView, query_data);
				}
				else {
					this._getContainer().innerHTML('');
				}

				this.select('none');

				return;
			}

			this['_scbx'+folder] = this._scbx;
			this._scbx = this['_scbx'+folder] || {};

			this.isChange('page'+folder, GET.page);

			this.$P('tpl');

			var
				  elId = this.getListId()
				, $Msg = $(document.getElementById(elId) || '<div id="'+ elId +'" class="js-msg-list"></div>')
			;

			mailru.MicroFormat.preload( true );

//			timer(this.id + ' [tpl]');
			if( this.template ){
				result_html	= $.tpl(this.template, this._getTplData(folder, !this.isShort, array));
			}
			else {

				this.$ExpandedSwitch.toggleClass(this.clExpandedSwitcherShort, !expanded);

				if (expanded) {
					this.TplExpanded.set( array );
				} else {
					this.Tpl.set( array );
				}

				if (array.length) {
					if (expanded) {
						result_html = this.TplExpanded.exec();
					} else {
						result_html = this.Tpl.exec();
					}
				} else {
					result_html = '<div class="loadProgress mb10 mt10">' + Lang.get('Loading').messages + '</div>';
				}
			}
//			timer(this.id + ' [tpl]', true);

			$Msg[0].innerHTML = result_html;

			if( !$Msg[0].parentNode || $Msg[0].parentNode.nodeType == 11 ){
				// If element is not in DOM, append him to main list
				this.$List.append( $Msg.attr('short', this.isShort ? 'Y' : 'N') );
			}
			else if( this.isShort && $Msg.attr('short') == 'N' ){
				// Store list state
				$Msg.attr('short', 'Y');
			}

			this.$P('tpl', 1);


			this.$P('MicroFormat');
			mailru.MicroFormat.preload( false );
			this.$P('MicroFormat', 1);


			this.$P('AttachViewer');
			mailru.ui.ClipInList.redraw();
			this.$P('AttachViewer', 1);

			// Fixed "Select all"
			this.select();

			this._clearCBX	= 0;
		},

		show: function (){
			if( !this.isActive() ) return;

			var $container = this._getContainer();

			this._cbx = 0; // last active checkbox
			this.hideList();

			this._checkView($container).display(1);

			this.$prevListContainer = $container;

			mailru.ui.ClipInList.redraw();
			this.select(); // Fix for Select All
		},


		clearList: function (id)
		{
			id = (id && id.Id ? id.Id : id);
			var $container = this._getContainer();
			$container.empty();
			mailru.Folders.get(id, true).set({ Unread: 0, Messages: 0 });
			documentView.redraw();
		},


		statusLine: function (type, txt, sec){
			return;
        },


		upd: function (flag, unread, $Msg){
			var
				  self = this
				, clUnread = self.clMsgUnread
				, Tpl = TemplateService.get('MsgIcon').parser( self.uniqId+'MsgParser' )
				, $cache = $({})
			;

			if( !$Msg ){
				$Msg = self.$CurSelCBX;
			}
			else if( !$Msg.jquery ){
				$Msg	= $('#' + self.idMsgPrefix + $Msg);
				$Msg	= ($Msg && $Msg.length) ? $Msg : this._dM;
			}

			if( $Msg ){
				if( flag !== undef ){
					$Msg.find('.js-flag-icon')
						.attr('title', Lang.get('MessagesFlags')[+flag])
						.toggleClass(self.clMsgFlagged, flag)
					;
				}

				if( unread !== undef ){
					$Msg.each(function (){
						$cache[0] = this;

						if( !self.template ){
							$cache.toggleClass(clUnread, unread==1);
						}

						var Msg = mailru.Messages.get( this.id.substr(self.idMsgPrefixLen) );
						if( Msg ){
							if( self.template ){
								$cache.replaceWith($.tpl(self.template, self._getTplData(Msg.FolderId, !self.isShort, [Msg])));
							} else {
								$cache.find('.js-ico').html( Tpl.set([Msg]).exec() );
							}
						}
					});
				}
			}
		},

		_getTplData: function (folder, expanded, array){
			return {
				  Msglist: 1
				, newsnippets: mailru.newsnippets
				, expanded: expanded
				, needShortLongMicroformat: !expanded
				, messages: array
				, selected: this._scbx
			};
		},

		getForm: function (){
			return	this.getView().closest('form');
		},

		getFolder: function (){
			return mailru.Folders.getSafe();
		},

		getMessages: function (){
			return	mailru.Messages.getByFolder( this.getFolder().Id );
		},

		getCurrentPage: function (){
			return	Math.max(GET.page*1||1, 1);
		},

		getMessagesPerPage: function (){
			return	mailru.messagesPerPage;
		},

		getMessagesOnPage: function (){
			var
				  count		= this.getMessages().length
				, page		= this.getCurrentPage()
				, perPage	= this.getMessagesPerPage()
				, pages		= Math.ceil(count / perPage)
			;
			return	page == pages ? Math.min(count - (page-1) * perPage, perPage) : perPage
		},

		hideList: function (){
			if( this.$List ){
				this.$List.children('.js-msg-list').display(0);
			}
		}

	});
	// Messages;


	jsCore.wait('mailru.ready', function (){
		//
		// Init controllers
		//
		mailru.Events
			.bind('select.messages.click', function (evt){
				mailru.View.Messages.getActive().select(evt.DATA);
			})
			.bind('fileDownload.click fileForward.click fileInArchive.click fileFromArchive.click forward.click mark.markmessage.click move.folder.click bookfilter.moveto.click redirect.click messages.forward.click messages.search.click', function (evt){
				var
					  View	= mailru.View.Messages.getActive()
					, IDs	= View.select()
					, type	= evt.type
				;

				if( IDs.length ) {
					var F = mailru.Folders.getSafe(), SentmsgView, message, url;

					if (type == 'fileDownload' || type == 'fileForward') {

						var size = 0, list = View.getMessages();
						if ($.isArray(list)) {
							$.each(list, function (k, data) {
								if ($.inArray(data.Id, IDs) !== -1) {
									size += data.size;
								}
							});
						}
						if (size > mailru['MaxAttachmentSize']) {
							var error = Lang.get(type == 'fileDownload' ? 'FileSearchDownloadSizeLimit' : 'FileSearchForwardSizeLimit');
							View.statusLine('attention', error);
							mailru.Notify.add('error', {text: error});
						} else {
							if (type == 'fileForward') {
								SentmsgView = jsView.get('sentmsg');
								if (SentmsgView) {
									SentmsgView.open('forward=&filesearch=1&id='+ IDs.join('&id='));
								}
							} else {
								var params = {
									partids: IDs.join('_'),
									mode: 'attachment',
									fname: 'attachments_' + Date.getNow().format('D-M-Y_H-I-S')
								};
								url = '//' + mailru.FilesSearchData.attach_host + '/cgi-bin/getattachment?' + $.param(params);
								window.open(url);
							}
						}

					} else {
						setTimeout(function () {

							if( type == 'fileInArchive' || type == 'fileFromArchive') {
								mailru.Messages.edit('move', IDs, type);
							} else if( evt.DATA === 'create_filter' ) {
								message = mailru.Messages.get(IDs[0]);
								var urlPrefix = (mailru.SettingsOn ? '/settings/filters?action=edit&msgid=' : '/cgi-bin/editfilter?msgid=') + message.Id;
								url = urlPrefix +'&fields=from&folder=' + F.Id;
								if (F.isSent() || F.isDrafts()) {
									url = urlPrefix + '&fields=to&folder=' + F.Id;
								}
								location.href = url;
							} else if( evt.TYPE == 'messages.search.click' ) {
								message = mailru.Messages.get(IDs[0]);
								url = mailru.getPageURL('search')+'?qc_from=1&q_from='+message.From+'&qc_to=1&q_to=&qc_subj=1&q_subj=&qc_text=1&mode=0&q_text=&ddb=&dmb=&dyb=&dde=&dme=&dye=&q_read=0&q_reply=0&qc_size=3&q_size=&q_prty=0&q_attach=0&q_folder=all&advanced=1';
								if (F.isSent() || F.isDrafts()) {
									url = mailru.getPageURL('search')+'?qc_from=1&q_from=&qc_to=1&q_to='+message.To+'&qc_subj=1&q_subj=&qc_text=1&mode=0&q_text=&ddb=&dmb=&dyb=&dde=&dme=&dye=&q_read=0&q_reply=0&qc_size=3&q_size=&q_prty=0&q_attach=0&q_folder=all&advanced=1';
								}
								jsHistory.set(url);
							} else if( type == 'forward' || type == 'fileForward' || evt.TYPE == 'messages.forward.click' ) {
								var forwardType = 'attach';

								if (type == 'fileForward') {
									forwardType = '';
									IDs = $.map(IDs, function (v, k) {
										return v.split(';')[0];
									});
								}

								SentmsgView = jsView.get('sentmsg');
								if (SentmsgView) {
									SentmsgView.open( 'forward=' + forwardType + '&id='+ IDs.join('&id=') );
								} else {
									var $form = $(document.forms['main']);
									if ($form.length) {
										$form.attr('action', mailru.getPageURL('compose'));
										$('<input type="submit" name="forward" value="' + forwardType + '" style="display: none;"/>').appendTo($form).click();
									}
								}
							}
							else if( type == 'redirect' ) {
								var captchaLayer;

								mailru.Layers.redirect(IDs[0], function (data) {

									var redirectLayer = this;

									function redirect (R) {

										if (captchaLayer) {
											captchaLayer.hide();
										}
										var result = R.getData();
										if ($.isArray(result)) {
											var res = result[0];
											if (res) {
												if (res.ShowSecurityImage) {
													$R('{mailru'+'.compose}mailru.Compose.Captcha', function() {
														if (!captchaLayer) {
															captchaLayer = new mailru.Compose.Captcha();
															captchaLayer.bind('checkSuccess', function (evt, code) {
																data.security_image_word = code;
																mailru.Messages.edit('redirect', IDs, data, redirect);
															});
														}
														redirectLayer.hide();
														captchaLayer.show();
													});
												} else if (res.status == 'SEND') {
													var L = mailru.Layers.get('redirect-done', ajs.retTrue);
													L.$Type.find('.status').hide().end().find(R.isOK() ? '.ok' : '.error').show();
													L.show();
												} else {
													alert($("<div>"+res.status+"<div>").find('B').remove().end().text());
													mailru.Events.fire('redirect.click');
												}
											}
										}
										else if (result === null || result && result.Error === null) {
											if (redirectLayer && redirectLayer.$Submit)
												redirectLayer.$Submit.attr('disabled', false);
											mailru.Notify.add('error');
										}
									}

									mailru.Messages.edit('redirect', IDs, data, redirect);
								});
							}
							else
							{
								mailru.Messages.edit(type, IDs, evt.DATA);
							}
						}, 1);
					}

				} else {
					View.statusLine('attention');
				}

				Dropdown.hide('dropdown');
				return	false;
			})

		// SPAM/NoSpam
			.bind('spam.click', function (evt){

				var
					  View	= mailru.View.Messages.getActive()
					, IDs	= View.select()
				;

				if( IDs.length )
				{
					if( evt.DATA == 'spamabuse' || evt.DATA == 'spam.definitely')
					{	// Mark as spam
						var data = { delorig: 'on', toblacklist: 'on' };

						if(evt.DATA == 'spam.definitely') {
							data.verified = 1;
						}

						mailru.Messages.confirmSpam(IDs, data);

						if( mailru.rb && !mailru.isSearchPage() && !mailru.isFileSearchPage() ){
							mailru.rb.click(mailru.isReadMsg ? 288799 : 288797);
						}
					}
					else
					{	// Mark as not spam
						mailru.Messages.edit('spam', IDs, false);
						if( mailru.rb && !mailru.isSearchPage() && !mailru.isFileSearchPage() ){
							mailru.rb.click(mailru.isReadMsg ? 399353 : 399354);
						}

						if( mailru.isReadMsg && mailru.ListUnsubscribeEnabled && mailru.Messages.get(IDs)[0].ListSubscribe) {
							Counter.sb(1611485)
						}
					}
				}
				else
					View.statusLine('attention');

				return	false;
			})
		;
	});


	jsLoader.loaded('{mailru.view}mailru.View.Messages', 1);

// data/ru/images/js/ru/Views/mailru.View.Messages.js end

// data/ru/images/js/ru/Views/mailru.View.SentMsg.js start


/**
	 * @class mailru.View.SentMsg
	 */
	jsView
		.create('mailru.View.SentMsg')
		.methods({

		_first: function ()
		{
			this._skip		= this.active;
			this.isFirst	= !(this.isSentMsg && ('MCompose' in window));
			this.isChange('hash', jsHistory.get());
		},

		_one: function ()
		{
			this.$View		= $( this.idView );
			this.$Loader	= $( this.idLoader );

			this.isChange('GET', String.toQuery(GET));

			if( this.isSentMsg )
			{	// preload compose files
				$R('{mailru'+'.build}Compose');
				//$.getCSS(jsLoaderFiles['compose.css'], jsCore.F);
				//$.getCSS(jsLoaderFiles['compose-skin.css'], jsCore.F);
			}
		},

		_load: function (data)
		{
			if( data._key_ && this[data._key_] ) data = this[data._key_];

			var key		= String.toQuery( data );
			var html	= this.preload();

			if( this.ajax )
			{
				this.ajax.abort();
				this.ajax = null;
			}

			if( !this.cache || (this._key !== key) )
			{
				this._key	= key;
				if( html !== undef )
				{
					this._html( html );
				}
				else
				{
					if( this.isFirst ) this.$View.html( '<div class="loadProgress mb10 mt10">' + Lang.get('Loading').messages + '</div>' );
					else if( this.isSentMsg && ('MCompose' in window) ) MCompose.reset();

					this.ajax = mailru.Ajax({
						url:		(this.isFirst && this.urlFirst || this.url) +'&jsb=1&first='+ (+this.isFirst),
						data:		data,
						type:		'POST',
						complete:	$DS(this, '_loaded')
					});
				}
			}
		},

		_loaded: function (R/*Ajax.Result*/)
		{
			if(this.isActive() )
			{
				if( R.isOK() )
				{
					var D = R.getData();
					if( D )
					{
						var html = D.HTML;
						if( html === undef )
						{
							if( this.isSentMsg && ('MCompose' in window) )
							{
								MCompose.redraw(D);
								mailru.uiRadar('sentmsg', 1)('onRedraw', 1)('all', 1)(true);
							}
						}
						else
							this._html(html, this.isFirst);
					}
					else
					{
						jsHistory.set(mailru.getPageURL('msglist', { folder: 'inbox' }));
						var View = mailru.View.Messages.getActive();
						if( View ) View.statusLine(R);
					}
				}
				else if( R.isError() ){
					this.$View.innerHTML('<p style="margin: 100px 50px;"><b>'+Lang.get('InternalError')+'</b></p>');
				}

				if( this.isSentMsg ){
					$('A[href*="sentmsg"]').each(function (){ $RA(this, 'href', /&\d+/, '&'+now()); });
				}
			}
		},

		_html:	function (html, first)
		{
			if( html.match(/mailru_build=(\d+)/) ){
				mailru.needReloadPage('build', RegExp.$1 * 1);
				mailru.needReloadPage('sendmsgok');
			}

			if (typeof fixedDocumentWrite == 'function')
				fixedDocumentWrite(document);

			this.$View[!this.append || first ? 'html' : 'append']( this.isSentMsg ? html : document.open(html) );

			if( this.isSentMsg )
			{
				if( 'MCompose' in window ) MCompose.focus();
				mailru.uiRadar('sentmsg')('onRedraw', 1)('all', 1)(true);
			}

			this.isFirst	= false;
		},

		_redraw:function (r, a)
		{
			if( this._skip )
			{
				this._skip	= 0;
				return;
			}

			if( this.isSentMsg )
			{
//				this.$View.display(a);
				if( r && a )
				{
					//this.$Loader.display(1);
					this._load(GET);
				}
				else if( !a )
				{
					if( this.ajax )
					{
						this.ajax.abort();
						this.ajax = null;
					}
					//this.$Loader.display(0);
				}
			}
			else
			{
				if( !r )
				{
					this.$View.display(a);
					$('#preload_banner_1').display(a);

					var ar = mailru.Messages.get( GET.id_orig ? [GET.id_orig] : jsView.get('folder.messages').select() );
					if( a && ar && ar[0] )
					{
						Array.forEach(ar, function (M)
						{
							if( GET.mode == 'reply' ) M.set('Reply', 1);
							else if( GET.mode == 'forward' ) M.set('Forward', 1);
						});
					}
				}
				else if( a && this.isChange('hash', jsHistory.get()) )
				{
					this._load(GET);
				}
			}
		},

	// @public
		preload:	function (html)
		{
			if( html === undef )
			{
				var h = this._h;
				this._h = undef;
				return	h;
			}
			else
				this._h = html;
		},

		open: function (data)
		{
			var key		= now();
			this[key]	= data;
			jsHistory.set(mailru.getPageURL('compose_key', { key: key }));
		},

		clearCache: function (){ this._key = undef; }

	});
	// mailru.View.SentMsg;


	jsLoader.loaded('{mailru.view}mailru.View.SentMsg', 1);

// data/ru/images/js/ru/Views/mailru.View.SentMsg.js end

// data/ru/images/js/ru/Views/mailru.View.LeftMenu.js start


/**
	 * @class mailru.View.LeftMenu
	 */
	ajs.createClass('mailru.View.LeftMenu', [jsView],
	{
	// @private
		_one: function ()
		{
			this.isChange('id', this.selectedId());
			this.isChange('hash', this.getHash());
		},

		_redraw: function (r, a)
		{
			if( r )
			{
//				if( this.isChange('hash', this.getHash()) )
				{
					this.getView().tpl( this.idTpl, this._tplData() );
				}
			}

			this._select(a && this.selectedId());
		},

		_select: function (id)
		{
			if( this.isChange('id', id) )
			{
				var c	= this.cnSelected;
				this.getView('.'+c).removeClass(c);
				if( id ) $(this.prefixId + id).addClass(c);
			}
		},

		_tplData: function ()
		{
			return	{ items: this.getItems(), selectedId: this.selectedId() };
		},

	// @public
		getHash: function ()
		{
			return	jsHistory.get();
		},

		getItems: function ()
		{
			return	[];
		},

		selectedId: function ()
		{
			return	-1;
		}

	});

	jsLoader.loaded('{mailru.view}mailru.View.LeftMenu', 1);

// data/ru/images/js/ru/Views/mailru.View.LeftMenu.js end

// data/ru/images/js/ru/Views/mailru.View.LettersList.js start


// data/ru/images/js/ru/Views/mailru.View.Paging.js start


/**
	 * @class mailru.View.Paging
	 */
	ajs.createClass('mailru.View.Paging', [jsView], {
	// @private
		_one: function () {
			//this.isChange('pages', this.pages());
		},

		_redraw: function (r, a) {
			if( r ) {
				var
					  pages = this.pages()
					, show = pages > 1
					, uniqueKey = mailru.SearchData && mailru.SearchData.search && mailru.SearchData.search.URLQ +'_'+ jsHistory.get()
				;

				if( this.isChange('hash', pages + '_' + this.selected() + '_' + uniqueKey) ) {
					this.getView()
						.display(show)
						[show ? 'tpl' : 'F']( this.idTpl, this._tplData() )
					;
				}
			}
		},

		_tplData: function ()
		{
			var
				  pages		= this.pages()
				, page		= this.selected()
				, from 		= Math.max(page - (pages - page < 3 ? 5 - (pages - page) : 3), 0)
				, to		= Math.min(from + 5, pages)
				, arPages	= []
			;

			for( var p = from + 1; p <= to; p++ ) {
				arPages.push({ Id: p, Selected: page == p });
			}

			return ajs.extend({
				  NoPager:			false
				, sortTop:			true
				, SEARCH:			mailru.isSearchPage()
				, FILESEARCH:		mailru.isFileSearchPage()
				, PrevPage:			(page > 1) ? page-1 : 0
				, FirstPage:		(pages > 5 && page > 3) ? 1 : 0
				, PrevHellipPage:	(page > 4 && pages > 6)
				, Page:				arPages
				, NextHellipPage:	(pages > 6 && pages - page > 3)
				, LastPage:			(pages > 5 && pages - page > 2) ? pages : 0
				, EndPage:			pages
				, NextPage:			(page < pages) ? page+1: 0
				, Folder:			~~ajs.isset(GET.folder, 0)
				, Sortby:			ajs.Html.escape(ajs.isset(GET.sortby, ''))
				, URLQ:				''
				, Random:			''
			}, this._tplExtData());
		},

		_tplExtData: function (){
			return	{};
		},


	// @public
		pages: function (){
			return 0;
		},

		selected: function (){
			return Math.max(Math.min(~~GET.page, this.pages()), 1);
		},

		next: function (){
			return Math.min(this.selected() + 1, this.pages());
		},

		prev: function (){
			return Math.max(this.selected() - 1, 1);
		}

	});

	jsLoader.loaded('{mailru.view}mailru.View.Paging', 1);

// data/ru/images/js/ru/Views/mailru.View.Paging.js end

// data/ru/images/js/ru/Views/mailru.View.PageOfPages.js start


/**
	 * @class mailru.View.PageOfPages
	 */
	ajs.createClass('mailru.View.PageOfPages', [jsView],
	{
	// @private
		_redraw: function (r, a)
		{
			if( r )
			{
				var data = this._tplData();
				if( this.isChange('hash', [data.MessageCount, data.FirstMessage]) )
				{
					this.getView().tpl(this.idTpl, data)
				}
			}
		},

		_tplData: function ()
		{
			var total = this.count(), page = Math.max(Math.min(~~GET.page, Math.ceil(total / mailru.messagesPerPage)), 1);
			return {
				  MessageCount:		total
				, FirstMessage:		(page-1)*mailru.messagesPerPage + 1
				, LastMessage:		Math.min(page * mailru.messagesPerPage, total)
				, messagesPerPage:	mailru.messagesPerPage
				, sortTop:			this.isTop
			};
		},

		count: function ()
		{
			return	0;
		}

	});

	jsLoader.loaded('{mailru.view}mailru.View.PageOfPages', 1);

// data/ru/images/js/ru/Views/mailru.View.PageOfPages.js end

/**
	 * @class mailru.View.LettersList
	 */
	ajs.createClass('mailru.View.LettersList', [jsView],
	{
	// @private
		_one: function ()
		{
			this.$H1	= this.getView('.js-h1');

			this.isChange('title', this.getTitle());

			//
			//  DISABLED
			/*

			// Page of pages (top & bottom)
			var pop	= this.pageOfPages;
			if( pop ){
				if( pop.top ){
					this.addSubView(new mailru.View.PageOfPages(pop.top));
				}

				if( pop.bottom ){
					this.addSubView(new mailru.View.PageOfPages(pop.bottom));
				}
			}

			// Paging (top & bottom)
			if( this.paging ){
				this.addSubView(new mailru.View.Paging(this.paging));
			}

			// Toolbar
			if( this.toolbar ){
				this.addSubView(new mailru.View.LettersToolbar(this.toolbar));
			}

			/**/
		},

		_redraw: function (r, a)
		{
			if( r )
			{
				var title = this.getTitle();
				if( this.isChange('title', title) )
				{
					this.$H1.innerHTML(title);
				}
			}
		},

	// @public
		getTitle: function ()
		{
		}

	});
	// mailru.View.LettersList;


	/**
	 * @class mailru.View.MsgList
	 */
	ajs.createClass('mailru.View.MsgList', [mailru.View.LettersList],
	{
		_one: function (){
			// Paging
			if( this.paging ){
				this.paging.pages = function (){ return Math.ceil(this.getCountMessages() / this.getMessagesPerPage()); }.bind(this);
			}

			// Page of pages
			var pop	= this.pageOfPages;
			if( pop ){
				if( pop.top ){
					pop.top.count = this.getCountMessages.bind(this);
				}

				if( pop.bottom ){
					pop.bottom.count = this.getCountMessages.bind(this);
				}
			}

			this.inherit(mailru.View.LettersList, '_one', arguments);
		},

	// @public
		getFolder: function (){
			return	mailru.Folders.getSafe();
		},

		getCountMessages: function (){
			return	this.getFolder().Messages;
		},

		getMessagesPerPage: function (){
			return	mailru.messagesPerPage;
		},

		getTitle: function (){
			return	this.getFolder().Name;
		}
	});


	jsLoader.loaded('{mailru.view}mailru.View.LettersList', 1);

// data/ru/images/js/ru/Views/mailru.View.LettersList.js end

// data/ru/images/js/ru/Views/mailru.View.PortalMenuSearch.js start


/**
	 * @class		mailru.View.PortalMenuSearch
	 * @namespace	mailru.FileSearchWithThumbnail
	 */
	jsView
		.create('mailru.View.PortalMenuSearch')
		.methods({
			_onReady: function (){
				this.$form = $('.js-form', '#portal-menu__search').submit(function (evt){
					if( !mailru.isSearchNoResultPage() ){
						var $form = $(this), $inp = $('.js-input', this), params = $form.toObject();
						if( $.trim($inp.val()) != '' || $inp.attr("data-allow-empty-value") ){
							if( mailru.isMRIMPage() ){
								// ничего не делаем
								// https://jira.mail.ru/browse/MAIL-16085
							}
							else if (mailru.isFileSearchPage()) {
								$.extend(params, {
									folder_id: 0,
									content_type_id: -1
								});

								if (defined(GET.folder_id)) {
									params.folder_id = encodeURIComponent(GET.folder_id);
								}

								if (defined(GET.content_type_id)) {
									params.content_type_id = encodeURIComponent(GET.content_type_id);
								}

								if (GET.only_hidden) {
									params.only_hidden = encodeURIComponent(GET.only_hidden);
								}

								jsHistory.set('filesearch?' + ajs.toQuery(params));
								Counter.sb(716199);
							} else {
								params.from_search = mailru.isSearchPage() ? 1 : 0;// MAIL-13870

								jsHistory.set(mailru.getPageURL('search') +'?'+ ajs.toQuery(params));

								mailru.Messages.loadSearch(GET);
							}
							mailru.Banners.View.reload();
							$inp.blur();
						}
						evt.preventDefault();
					}
				});
			},


			_redraw: function () {
				if( $.isReady ){
					var text;

					switch(true) {
						case mailru.isAddressbookPage():
							text = Lang.get('search.onaddressbook');
							break;

						case mailru.isFileSearchPage():
							text = Lang.get('search.onfiles');
							break;

						case mailru.isMRIMPage():
							text = Lang.get('search.onagent');
							break;

						default:
							text = Lang.get('search.onmail');
							break;
					}

					$('.js-labelText', this.$form).text(text);
				}
			}
		})
	;


	jsLoader.loaded('{mailru.view}mailru.View.PortalMenuSearch', 1);

// data/ru/images/js/ru/Views/mailru.View.PortalMenuSearch.js end

// Template settings
	Template.OPEN	= '#{';
	Template.CLOSE	= '}';


	// WTF????
	jsClass.create('mailru.ReadMsg').statics({ radar: createRadar('mailru_ReadMsg') });
	jsClass.create('mailru.Banners').statics();


	// Views
	mailru.Banners.View		= new mailru.View.Banners();
	mailru.ReadMsg.View		= new mailru.View.ReadMsg();


	jsCore.ready(function (){
	// Build Views
	documentView
	/**/
		.addSubView(new mailru.View.HotKeys({
			  id:			'HotKeys'
			, _active:	function (){ return mailru.isReadMsgPage() || mailru.isMsgListPage() || mailru.isSearchPage() || mailru.isFileSearchPage(); }
		}))
		.addSubView(new mailru.View.Elms.Head({
			  id:			'head'
			, events:		'reload.folders update.folders update.message update.head updated.folder'
			, idMenuRow:	'#row_link_to_unread'
			, idNavigation:	'#ddbuttons'
		}))
		.group({
			  id:		'SentMsgGroup'
			, _active:	function (){ return !mailru.v2 && (mailru.isComposePage() || mailru.isSendMsgOkPage()); }
		}, function (){
			this
				.addSubView(new mailru.View.Compose({
					  id:		'sentmsg'
					, idView:	'#MailRuSentMsg'
					, active:	mailru.isComposePage()
					, autoload:	true
					, _active:	function (){ return mailru.isComposePage(); }
				}))
				.addSubView(new mailru.View.SentMsg({
					  id:		'sendmsgok'
					, url:		'/compose/?ajax_call=1&func_name=get_sendmsgok'
					, idView:	'#MailRuSentMsgOk'
					, cache:	true
					, active:	mailru.isSendMsgOk
					, _active:	function (){ return mailru.isSendMsgOkPage(); }
				}))
			;
		})
		.group({
			  id:		'MsgListGroup'
			, _active:	function (){
				return	!mailru.v2 && (mailru.isMsgListPage() || mailru.isReadMsgPage() || mailru.isSentMsg || mailru.isSendMsgOk);
			}
			, _redraw: function (r, a)
			{
				if( !r )
				{
//					jsView.get('leftcol__msglist').getView().display( a );
				}
			}
		}, function ()
		{
			/*
			this.group({ id: 'leftcol__msglist' }, function ()
			{
				this.addSubView(new mailru.View.Folders({
					  id:			'folders.menu'
					, idView:		'#leftcol__folders'
					, idMenu:		'#foldersStartId,#msglist__filters'
					, clSel:		'menu__item__link_act'
					, clIsUnread:	'menu__item__link_unread'
					, clClearHover:	'menu__item__link__clear_hover'
				}));
			});
			*/

			this
				/*
				.addSubView(new mailru.View.Folder({
					  id:		'folder.content'
					, idMessagesView: 'folder.messages'
					, idView:	'#MsgListContent'
					, idMenu:	'#foldersStartId'
					, idTitle:	'#id-folder-name'
					, idContent:'#MainForm'
					, idEmpty:	'#id-messages-list-empty'
					, idSender:	'.ajax-add-sender'
					, _active:	function (){ return mailru.isMsgListPage(); }
				}))
				*/
				.group({
					  id: 'FolderGroup'
					, _active: function (){ return (mailru.isMsgListPage() || mailru.isReadMsgPage()); }
				}, function ()
				{
					this
						.addSubView(new mailru.View.Folders.DropDown({
							  id:			'folders.dropdown'
							, idMessagesView: 'folder.messages'
							, idTpl:		'#FolderDD'
							, idView:		'#MsgList_ReadMsg'
							, cssElms:		'.dropdown'
							, clSel:		'dropdown__list__item_disabled'
							, clLink:		'dropdown__button, .dropdown__checkbox'
							, clContainer:	'dropdown__list'
						}))
						.addSubView(new mailru.View.Folder.SpamButtons({
							  id:		'folder.spambuttons'
							, idView:	'#MsgList_ReadMsg .js-spam'
						}))
						.group({
							  id:		'MessagesGroup'
							, _active:	function (){ return mailru.isMsgListPage(); }
						}, function ()
						{
							this
								.addSubView(new mailru.View.PageOfPages({
									  idTpl:	'#menu_msg_pageofpages_ejs'
									, idView:	'#MsgListContent .js-PageOfPages:first'
									, isTop:	true
									, count:	function (){ return mailru.Folders.getSafe()[mailru.threads ? 'Threads' : 'Messages']; }
								}))
								.addSubView(new mailru.View.PageOfPages({
									  idTpl:	'#menu_msg_pageofpages_ejs'
									, idView:	'#MsgListContent .js-PageOfPages:last'
									, count:	function (){ return mailru.Folders.getSafe()[mailru.threads ? 'Threads' : 'Messages']; }
								}))
								.addSubView(new mailru.View.Paging({
									  id:			'msglist__paging'
									, idTpl:		'#paging_ejs'
									, idView:		'#MsgListContent .js-paging'
									, tag:			'paging'
									, pages:		function (){ return Math.ceil(mailru.Folders.getSafe()[mailru.threads ? 'Threads' : 'Messages'] / mailru.messagesPerPage); }
									, _tplExtData:	function (){ return { URLQ: mailru.isFilterFolder() ? mailru.SearchData.search.URLQ : '' } }
								}))
								.addSubView(new mailru.View.Messages({
									  id:				'folder.messages'
									, tag:				'letterslist'
									, idRoot:			'#MsgList_ReadMsg'
									, idMsgPrefix:		'msglist-'
									, getListId:		function () {
										return 'ML'+ mailru.getFolderId();
									}
									, cssList:			'#id-messages-list'
									, cssToolBar:		'.toolbar'
									, cssSort:			'.is-sort'
									, clMsg:			'js-msg'
									, clIco:			'js-ico'
									, clMsgSel:			'messageline_selected'
									, clMsgUnread:		'messageline_unread'
									, clIcoUnread:		'icon_message-status_500'
									, clIcoRead:		'icon_message-status_0'
									, clMsgAttach:		'messageline__attach_hasOne'
									, clMsgFlag:		'messageline__flag__icon'
									, clMsgFlagged:		'icon_message-flag_on'
									, clMsgIco:			'messageline__body__name messageline__body__name_ico-from'
									, clMsgIcoNo:		'messageline__body__name'
									, clViewType:		'toolbar__buttons_messagelist-mode'
									, clListShort:		'messagelist_media_simple'
									, clSwitchShort:	'mr_toolbar__mode_short'
									, switchMode: {
										cnActive:	'dropdown__list__item__link_selected',
										cssShort: 	'.js-messagelist-compact',
										cssFull: 	'.js-messagelist-microformat'
									}
									, clFolderHover:	'menu__item__link_hover'
									, clDisabled:		'messageline_disabled'
									, dragdrop:			true
									, tplId:			'tplMsg'
									, template:			'#msglist__messageline_ejs'
									, idEmptyView:		'#msglist__empty_ejs'
									, isEmptyCollector:	'#ejs-msglist__empty_collector'
								}))
							;
						})
						.addSubView(new mailru.View.ReadMsgNew({
							  id:		'readmsg'
							, idView:	'#ReadMsg'
							, active:	mailru.isReadMsgPage()
							, _active:	function (){ return mailru.isReadMsg; }
							, clNav:	'paging__item_disabled'
						}))
					;
				})
			;
		})
		.addSubView(new mailru.View.PortalMenuSearch({ id: 'portal_menu_search' }))
		.group({
			  id:		'search'
			, _active:	function (){ return mailru.isSearchPage(); }
			, _one:		function (){
							this.$Filters = $('#leftcol__search__filters :checkbox').click(function (){
								jsHistory.build($('#leftcol__search__filters').toObject(), ['q_read', 'q_flag', 'q_attach', 'page']);
							});
						}
			, _redraw:	function (r, a){
				if( !r ){
					jsView.get('leftcol__search').getView().display( a );
					jsView.get('search__result').getView().display( a );
				}
				else {
					this.$Filters
						.filter('.js-unread').attr('checked', GET.q_read == 2).end()
						.filter('.js-flagged').attr('checked', GET.q_flag == 2).end()
						.filter('.js-attach').attr('checked', GET.q_attach == 1).end()
					;
				}
			}
		}, function (){

			// Left coll
			this.group({ id: 'leftcol__search' }, function (){
				this
					.addSubView(new mailru.View.LeftMenu({
						  id:		'leftcol__search__persons'
						, idTpl:	'#leftcol__search__persons_ejs'
						, tag:		'menu'
						, _tplData:	function (){ return mailru.SearchData.search; }
						, getItems:	function (){ }
					}))
					.addSubView(new mailru.View.LeftMenu({
						  id:		'leftcol__search__folders'
						, idTpl:	'#leftcol__search__folders_ejs'
						, tag:		'menu'
						, _tplData:	function (){ return mailru.SearchData.search; }
						, getItems:	function (){ return mailru.SearchData.search.SearchFolder; }
					}))
					.addSubView(new mailru.View.LeftMenu({
						  id:		'leftcol__search__dates'
						, idTpl:	'#leftcol__search__dates_ejs'
						, tag:		'menu'
						, _tplData:	function (){ return mailru.SearchData.search.dates; }
					}))
					.addSubView(new jsView({
						  id: 'leftcol__search__informer'
						, _active: function (){ return $.trim(GET.q_query||'') != ''; }
						, _redraw: function (r, a){
							if( r ){
								this.getView('.js-url').each(function (){ this.href = this.href.replace(/(q|common)=[^&]*/, '$1='+ajs.encode(GET.q_query)); });
								this.getView('.js-query').text(GET.q_query);
							}
							else {
								this.getView().display(a);
							}
						}
					}))
				;
			});


			// Content
			this.group(new mailru.View.LettersList({ id: 'search__result' }), function (){
				this
					.addSubView(new mailru.View.PageOfPages({
						  idTpl:	'#menu_msg_pageofpages_ejs'
						, idView:	'#search__result .js-PageOfPages:first'
						, isTop:	true
						, count:	function (){ return mailru.SearchData.search.count; }
					}))
					.addSubView(new mailru.View.PageOfPages({
						  idTpl:	'#menu_msg_pageofpages_ejs'
						, idView:	'#search__result .js-PageOfPages:last'
						, count:	function (){ return mailru.SearchData.search.count; }
					}))
					.addSubView(new mailru.View.Paging({
						  id:			'search__paging'
						, idTpl:		'#paging_ejs'
						, idView:		'#search__result .js-paging'
						, tag:			'paging'
						, pages:		function (){ return Math.ceil(mailru.SearchData.search.count / mailru.messagesPerPage); }
						, _tplExtData:	function (){ return { URLQ: mailru.SearchData.search.URLQ } }
					}))
					.addSubView(new mailru.View.Folders.DropDown({
						  idTpl:		'#FolderDD'
						, idView:		this.idView
						, idMessagesView: 'search.messages'
						, cssElms:		'.dropdown'
						, clSel:		'dropdown__list__item_disabled'
						, clLink:		'dropdown__button, .dropdown__checkbox'
						, clContainer:	'dropdown__list'
					}))
					.addSubView(new mailru.View.Folder.SpamButtons({
						  idView:	'.js-spam, .ajax-add-sender'
					}))
					.addSubView(new mailru.View.Messages({
						  id:			'search.messages'
						, tag:			'letterslist'
						, idRoot:		'#search__result'
						, idMsgPrefix:	'search-'
						, getListId:	function () {return 'search-messages-list';}
						, cssList:		'#search-messages-list'
						, cssToolBar:	'.toolbar'
						, cssSort:		'.is-sort'
						, clMsg:		'js-msg'
						, clIco:		'js-ico'
						, clMsgSel:		'messageline_selected'
						, clMsgUnread:	'messageline_unread'
						, clIcoUnread:	'icon_message-status_500'
						, clIcoRead:	'icon_message-status_0'
						, clMsgAttach:	'messageline__attach_hasOne'
						, clMsgFlagged: 'icon_message-flag_on'
						, clMsgIco:		'messageline__body__name messageline__body__name_ico-from'
						, clMsgIcoNo:	'messageline__body__name'
						, clViewType:	'toolbar__buttons_messagelist-mode'
						, clListMicroformat:	'messagelist_search_expanded'
						, clListShort:	'messagelist_media_simple'
						, clSwitchShort:'mr_toolbar__mode_short'
						, switchMode:	{ cnActive: 'dropdown__list__item__link_selected', cssShort: '.js-messagelist-compact', cssFull: '.js-messagelist-microformat' }
						, clFolderHover:'lmTRMove'
						, clDisabled:	'messageline_disabled'
						, clMessageLink: 'messageline__body__link'
						, dragdrop:		false
						, tplId:		'search__result_tpl'
						, template:		'#search__messageline_ejs'
						, idEmptyView:	'#search__result__empty_ejs'
						, getFolder:	function (){ return mailru.Folders.getSearch( GET.q_folder ); }
					}))
				;
			});
		})
		.group({
			  id:		'fileSearch'
			, _active:	function (){ return mailru.isFileSearchPage(); }
			, _redraw:	function (r, a)
			{
				if( !r )
				{
					jsView.get('leftcol__fileSearch').getView().display( a );
					jsView.get('fileSearch__result').getView().display( a );
				}
			}
		}, function ()
		{
			this.group({ id: 'leftcol__fileSearch' }, function ()
			{
				this
					.addSubView(new mailru.View.LeftMenu({
						  id:		'leftcol__fileSearch__folders'
						, idTpl:	'#leftcol__fileSearch__folders_ejs'
						, tag:		'menu'
						,  _onReady: function () {
							this.getView().delegate('.js-link', 'click', function(){
								// MAIL-6310
								var id = $(this).data('folder_id'), counters = {
									'0': 716190,
									'500000': 716191,
									'-1': 716192
								};
								Counter.sb(counters[id] || 716193);
							});
						}
						, _tplData:	function () {

							var params = {
								Folder: arMailRuFolders,
								folder_id: 0,
								content_type_id: -1,
								only_hidden: 0,
								q_query: ''
							};

							if (defined(GET.folder_id)) {
								params.folder_id = encodeURIComponent(GET.folder_id);
							}

							if (defined(GET.content_type_id)) {
								params.content_type_id = encodeURIComponent(GET.content_type_id);
							}

							if (GET.only_hidden) {
								params.only_hidden = 1;
							}

							if (GET.q_query) {
								params.q_query = encodeURIComponent(GET.q_query);
							}

							return params;
						}
					}))
					.addSubView(new mailru.View.LeftMenu({
						  id:		'leftcol__fileSearch__types'
						, idTpl:	'#leftcol__fileSearch__types_ejs'
						, tag:		'menu'
						,  _onReady: function () {
							this.getView().delegate('.js-link', 'click', function() {
								// MAIL-6310: rb.counters
								var id = $(this).data('content_type_id'), counters = {
									'1': 716183,
									'4': 716184,
									'2': 716185,
									'3': 716186,
									'0': 716187,
									'-1': 716188
								};
								counters[id] && Counter.sb(counters[id]);
							});
						}
						, _tplData:	function () {

							var params = {
								folder_id: 0,
								content_type_id: -1,
								only_hidden: 0,
								q_query: ''
							};

							if (defined(GET.folder_id)) {
								params.folder_id = encodeURIComponent(GET.folder_id);
							}

							if (defined(GET.content_type_id)) {
								params.content_type_id = encodeURIComponent(GET.content_type_id);
							}

							if (GET.only_hidden) {
								params.only_hidden = 1;
							}

							if (GET.q_query) {
								params.q_query = encodeURIComponent(GET.q_query);
							}

							return params;
						}
					}))
					.addSubView(new mailru.View.LeftMenu({
						  id:		'leftcol__fileSearch__other'
						, idTpl:	'#leftcol__fileSearch__other_ejs'
						, tag:		'menu'
						,  _onReady: function () {
							this.getView().delegate('.js-link', 'click', function(evt) {
								// MAIL-6310
								Counter.sb(716189);
							});
						}
						, _tplData:	function () {
							return {
								only_hidden: defined(GET.only_hidden) ? encodeURIComponent(GET.only_hidden) : 0,
								folder_id: defined(GET.folder_id) ? encodeURIComponent(GET.folder_id) : null,
								q_query: defined(GET.q_query) ? encodeURIComponent(GET.q_query) : '',
								content_type_id: defined(GET.content_type_id) ? encodeURIComponent(GET.content_type_id) : -1
							};
						}
					}))
				;
			});

			this.group(new mailru.View.LettersList({
				  id:			'fileSearch__result'
			}), function ()
			{
				this
					.addSubView(new jsView({
						  _one: function () {
							var $parent = this.parentView().getView();
							this.$title = $('#id-folder-name', $parent);
							this.$archiveButtons = $('.js-fileInArchive,.js-fileFromArchive', $parent);
							this.$listContainer = $('#fileSearch-messages-list');
							this.$searchInput = $('.js-input', jsView.get('portal_menu_search').$form);
						}
						, _redraw: function (r, a) {
							if (r) {
								if (this.isChange('q_query', GET.q_query)) {
									this.$title.innerHTML(GET.q_query ? Lang.get('search.results') : Lang.get('Files').Title);

									if (!GET.q_query) {
										this.$searchInput.focus().val('').blur();
									}
								}
								if (this.isChange('only_hidden', GET.only_hidden)) {
									this.$archiveButtons.display(0).filter(GET.only_hidden ? '.js-fileFromArchive' : '.js-fileInArchive').display(1);
								}
								if (this.isChange('folder_id', GET.folder_id)) {
									this.$listContainer.toggleClass('messagelist_files-search_short',!defined(GET.folder_id) || GET.folder_id != -1);
								}
							}
						}
					}))
					.addSubView(new mailru.View.PageOfPages({
						  idTpl:	'#menu_fileSearch_pageofpages_ejs'
						, idView:	'#fileSearch__result .js-PageOfPages:first'
						, isTop:	true
						, count:	function (){ return mailru.FilesSearchData.total; }
						, _tplData: function () {
							var total = this.count(), page = ajs.isset(GET.page, 1), num = mailru.filesPerPage;
							return {
								  MessageCount:		total
								, FirstMessage:		(page - 1) * num + 1
								, LastMessage:		Math.min(page * num, total)
								, messagesPerPage:	num
								, sortTop:			this.isTop
							};
						}
					}))
					.addSubView(new mailru.View.PageOfPages({
						  idTpl:	'#menu_fileSearch_pageofpages_ejs'
						, idView:	'#fileSearch__result .js-PageOfPages:last'
						, count:	function (){ return mailru.FilesSearchData.total; }
						, _tplData: function () {
							var total = this.count(), page = ajs.isset(GET.page, 1), num = mailru.filesPerPage;
							return {
								  MessageCount:		total
								, FirstMessage:		(page - 1) * num + 1
								, LastMessage:		Math.min(page * num, total)
								, messagesPerPage:	num
								, sortTop:			this.isTop
							};
						}
					}))
					.addSubView(new mailru.View.Paging({
						  id:			'fileSearch__paging'
						, idTpl:		'#paging_ejs'
						, idView:		'#fileSearch__result .js-paging'
						, tag:			'paging'
						, pages:		function (){ return Math.ceil(mailru.FilesSearchData.total / mailru.filesPerPage); }
						, _tplExtData:	function () {

							var params = {
								folder_id: 0,
								content_type_id: -1
							};

							if (defined(GET.folder_id)) {
								params.folder_id = GET.folder_id;
							}

							if (defined(GET.content_type_id)) {
								params.content_type_id = GET.content_type_id;
							}

							if (GET.only_hidden) {
								params.only_hidden = GET.only_hidden;
							}

							if (GET.q_query) {
								params.q_query = GET.q_query;
							}

							return { URLQ: '&' + ajs.toQuery(params) };
						}
					}))
					.addSubView(new mailru.View.Folders.DropDown({
						  idTpl:		'#FolderDD'
						, idView:		this.idView
						, idMessagesView: 'fileSearch.messages'
						, cssElms:		'.dropdown'
						, clSel:		'dropdown__list__item_disabled'
						, clLink:		'dropdown__button, .dropdown__checkbox'
						, clContainer:	'dropdown__list'
					}))
					.addSubView(new mailru.View.Messages({
						  id:			'fileSearch.messages'
						, tag:			'letterslist'
						, idRoot:		'#fileSearch__result'
						, idMsgPrefix:	'fileSearch-'
						, getListId:	function () {return 'fileSearch-messages-list';}
						, cssList:		'#fileSearch-messages-list'
						, cssToolBar:	'.toolbar'
						, cssSort:		'.is-sort'
						, clMsg:		'js-msg'
						, clIco:		'js-ico'
						, clMsgSel:		'messageline_selected'
						, clMsgUnread:	'messageline_unread'
						, clIcoUnread:	'icon_message-status_500'
						, clIcoRead:	'icon_message-status_0'
						, clMsgAttach:	'messageline__attach_hasOne'
						, clMsgFlagged: 'icon_message-flag_on'
						, clMsgIco:		'messageline__body__name messageline__body__name_ico-from'
						, clMsgIcoNo:	'messageline__body__name'
//							, clViewType:	'toolbar__buttons_messagelist-mode'
						, clExpandedSwitcher:'js-switcher'
						, clExpandedSwitcherShort:'attachlist__header__mode_short'
						, clExpandedList:'filesearch__thumbnail__list'
						, clExpandedThumbnail:'filesearch__thumbnail'
						, clExpandedThumbnailDownloadLink:'filesearch__thumbnail__download__link'
						, clExpandedThumbnailCheckboxLabel:'filesearch__thumbnail__checkbox__label'
						, clExpandedThumbnailBody:'filesearch__thumbnail__body'
//							, clListShort:	'messagelist_simple'
//							, clSwitchShort:'mr_toolbar__mode_short'
//							, switchMode:	{ cnActive: 'button-a_active', cssShort: '.button-a_messagelist-simple', cssFull: '.button-a_messagelist-microformat' }
						, clFolderHover:'lmTRMove'
						, clDisabled:	'messageline_disabled'
						, dragdrop:		false
						, tplId:		'fileSearch__result_ejs'
						, tplExpandedId:'fileSearch__result__expanded_ejs'
//						, template:		'#files-search__messageline_ejs'
						, idEmptyView:	'#fileSearch__result__empty_ejs'
						, getFolder:	function (){
											var id	= mailru.getFolderId();
											return	mailru.Folders.getSafe( id );
										}
						, getMessages: function () {
							return mailru.FilesSearchData.list;
						}
					}))
				;
			});
		});
		/* mailru.Views > */
	});

	jsCore.notify('mailru.Views.ready');
	jsLoader.loaded('{mailru.view}mailru.View', 1);

// data/ru/images/js/ru/Views/mailru.View.js end

debug.clear		= jsCore.local && window.console && window.console.clear || jsCore.F;
	jsCore.saveMode	= true;

	//
	// Counters (https://sys.mail.ru/task_viewer.php?id=792630)
	//
	(function (m){
		var a = {
			folders:{
				  inbox:	366161
				, sent:		366499
				, trash:	366500
				, spam:		366501
				, user:		366503
			},
			pages: {
				  1:	366507
				, 2:	366508
				, 3:	366510
				, other:366511
			},
			mode:	{
						  'short':	{ top: 366543, bottom: 366544 }
						, detail:	{ top: 366546, bottom: 366548 }
					},
			clickBy:	{ flag: 366553, attachIco: 366558 }
		};

		m.rb = function (type, name, sub, tb)
		{
			var src = '//rs.' + mailru.SingleDomainName + '/'+ (type == 'click' ? 'sb' : 'd') +'%d.gif?rnd='+Math.random();
			if( name && (name in a) )
			{
				var c = a[name];
				if( sub && (sub in c) ) c = c[sub];
				if( c && c.top ) c = c[(tb === undef ? (sub === undef ? 1 : sub) : tb) ? 'top' : 'bottom'];
				if( c && (c > 0) )
				{
					(new Image).src = src.replace('%d', c);
					return	true;
				}
			}
			else if( !isNaN(name) && name > 0 )
			{
				(new Image).src = src.replace('%d', name);
			}
			return	false;
		};
		m.rb.show	= function (name, sub, tb){ return m.rb('show', name, sub, tb); };
		m.rb.click	= function (name, sub, tb){ return m.rb('click', name, sub, tb); };
		m.rb.clickAndShow	= function (name, sub, tb){ return m.rb.click(name, sub, tb) && m.rb.show(name, sub, tb); };
	})(mailru);


	location.getHref = function () {
		var l = location, r = l.hash.length > 4 ? l.hash.replace(/.*#/, '') : l.href;
		if( !/^http/.test(r) ) r = l.protocol + '//'+ l.hostname +'/cgi-bin/'+ r;
		return r;
	};


	(function (win, $)
	{
		var _timers = {};
		win.timer = function (name)
		{
			if( arguments.length == 2 )
			{
				var t = ajs.now() - _timers[name];
				debug.log('timer.'+name+':', t, 'ms');
			}
			else
				_timers[name] = ajs.now();
		};

		// GLOBALS
		win.GET = GET;
		_parseURL(jsHistory.setModifier(location.pathname));
	})(window, jQuery);


	function _parseURL(url){
		mailru._updIsPageVars(url);
	}



	// Ready
	jQuery(function (){
		if( !(mailru.isMailboxPage() || mailru.v2 && mailru.isMRIMPage()) ){
			// @todo Этот код вообще не должен подключатся на страницах, кроме isMailboxPage, но где-то бага
			return;
		}


		// RUN UPDATER
		mailru.Updater.run();


		// Global events
		mailru.Events
			.bind('update.message error.message', function (evt){
				if( !mailru.v2 && mailru.isReadMsg && evt.DATA && evt.DATA[2] && evt.DATA[2].id == GET.id ){
					mailru.ReadMsg.View.redraw( evt.DATA[1], evt.DATA[2], evt.DATA[3] );
				}
			})
			.bind('hashchange', function (evt){
				function getFolderId(url) {
					var folderIdByName = {'spam' : 950, 'sent' : 500000, 'drafts' : 500001, 'trash' : 500002},
						reg = /^\/messages\/(inbox|sent|drafts|spam|trash)|(folder\/(\d+))/,
						res = reg.exec(url);
					if(res){
						res = folderIdByName[res[1]] || res[3];
					}
					else {
						res = mailru.getFolderId();
					}
					return res || 0;
				}
                var	F	= mailru.Folders.get( String.toObject(evt.DATA).folder || getFolderId(evt.DATA));
				if( F && !F.isSecureOpen() ){
					mailru.Events.fire('accessdenied.folder', F.Id);
					return	false;
				}
				else {
					mailru.Layers.hide();
				}
			})
			.bind('move.click spam.click fileDownload.click', function (evt) {
				if (mailru.isMsgList) {
					if (evt.type == 'move') {
						if (evt.DATA == mailru.Folder.TRASH) {
							$(window).triggerHandler('controlClick.msglist', ['delete']);
						}
					} else if (evt.type == 'spam') {
						$(window).triggerHandler('controlClick.msglist', ['spam']);
					}
				} else if (mailru.isFileSearchPage()) {
					if (evt.type == 'fileDownload') {
						$(window).triggerHandler('controlClick.msglist', ['fileDownload']);
					}
				}
			})
			.bind('accessdenied.folder', function (evt){
				mailru.Layers.secure(evt.DATA, function (access){
				var url = '/messages', id = evt.DATA;
				switch (parseInt(id,10)) {
					case 0	    : url += '/inbox'; break;
					case 950    : url += '/spam'; break;
					case 500000 : url += '/sent'; break;
					case 500001 : url += '/drafts'; break;
					case 500002 : url += '/trash'; break;
					case 500003 :
					case 500005 : url = '/agent/archive'; break;
					default     : url += '/folder/' + id;
				}
				if( access ) jsHistory.set(url);
                });
			})
			.bind('redirect.ajax', function (evt){
				var Res			= evt.DATA;
				location.href	= Res.getData();
			})
		;


		mailru._loadPage = function (url, isSet){
			url	= jsHistory.setModifier(url);

			if( this._loadPageUrl != url ){
				this._loadPageUrl = url;
				mailru.Router.nav((/^\//.test(url) ? '' : '/') + url); // NEW ROUTER

				var GET = mailru._updGETVars(url);
				_parseURL(url.match(/([\w_-]+)(\?|$)/i) && RegExp.$1);

				__tsMsgListLog = true;
				var pageLabel = mailru.getPageLabel(url);
				mailru.uiRadar(pageLabel)('all');	// Get radar by name + start timers
				mailru.uiRadar(pageLabel)('request');

				// Redraw all views
				var redraw = documentView.redraw();

				// Run updater
				if( mailru.isMsgListPage() ){
					mailru.Updater.reload(true, { bnrs: 'N' });
				}

 				if( mailru.isReadMsgPage() ){
					var Msg = mailru.Messages.get( GET.id );

					mailru.radar('mailru_Messages_get', (redraw ? 'cache' : 'load') + '=1');

					mailru.ReadMsg.radar('clear')('all');
					mailru.ReadMsg._ID = GET.id;
					mailru.ReadMsg._MODE = GET.mode;

					if( !mailru.threads ){
						mailru.Messages.load( GET, undef, true ); // load
					}

					if( !mailru.v2 ){
						if( Msg && Msg.isLoaded() ){
							mailru.ReadMsg.View.redraw( Msg, GET );
						}
						else {
							mailru.ReadMsg.View.toggleControls(true);
						}
					}
				}
				else if( (mailru.isSearchPage() || mailru.isFilterFolder()) && !mailru.v2 ) {
					mailru.Messages.loadSearch( GET );
				}
				else if( mailru.isFileSearchPage() && !mailru.v2 ) {
					mailru.Messages.loadFilesSearch( GET );
				}

				$(window).unbind('errorloadpage.loadPage').bind('errorloadpage.loadPage', function (evt, url){
					if( mailru._loadPageUrl == url ){
						mailru._loadPageUrl = null;
					}
				});

				mailru.Banners.View.reload();
			}


			if( isSet ){
				if( !mailru.Updater.active && !mailru.isReadMsgPage() ){
					mailru.Updater.reload(true);
				}
			}
		};


		// < History
		var
			  isRelHref	= /^javascript/i
			, _rhttp	= /^https?:\/\/[^/]+/
			, _rcln		= /^\/cln\d+\/[^/]+/
			, __tsMsgList, __tsMsgListLog
		;

		ajs.click(function (evt){
			timer('click');

			var A = evt.currentTarget;

			if( !jsHistory.disabled && ajs.Mouse.isLeft(evt) && (A.rel == 'history') && !(evt.ctrlKey || evt.metaKey || evt.shiftKey) ){
				if( !isRelHref.test(A) ){
					if( !A.getAttribute('disabled') ){
						var url = A.href.replace(_rhttp, '').replace(_rcln, ''), cN = A.className;

						mailru.isClickOnMsgNav	= /url-(prev|next)/i.test(cN);
						mailru.isClickOnMsgPrev	= /url-prev/i.test(cN);
						mailru.disabledMsgCache	= mailru.isReadMsg && !mailru.isClickOnMsgNav;

						if( !mailru.needReloadPage('href', url) && (mailru.Events.fire('hashchange', url) !== false) ){
							// Scroll on top
							$Scroll[jsHistory.setModifier(url)] = 0;

							if( jsHistory.set( url ) ){
								mailru._loadPage(url, true);
							}
						}

						A.hideFocus = true;
					}

					//timer('click', 1);
					evt.preventDefault();
				}
			}
		});
		$(window).blur(function (){ jsHistory.disabled = false; });
		// History >


		var jsViewOnBeforeRedraw = function (){
			mailru._updGETVars(jsHistory.get());
			jsView.get('folder.messages').statusLine('count');
			jsView.get('search.messages').statusLine('count');
			documentView.redraw();
		};

		documentView.onBeforeRedraw = function (){
			var fId = mailru.getFolderId(), r = true, isSearch = mailru.isSearchPage(), isFileSearch = mailru.isFileSearchPage();

			if( mailru.isMsgList || isSearch || isFileSearch ){
				if( isSearch || mailru.isFilterFolder() ){
					r = mailru.Messages.hasSearchCache(GET);
					isSearch = true;
				}
				else if( isFileSearch ){
					r = _first || mailru.Messages.hasFilesSearchCache(GET);
				}
				else {
					r = mailru.Folders.hasCache(GET.folder, GET.page);
				}

				if( !r ){
					if( !isSearch && !isFileSearch ){
						jsView.get('folder.messages').statusLine('load');

						mailru.Events
							.unbind('beforestop.updater beforeloaded.search')
							.unbind('stop.updater.beforeRedraw')
							.one('stop.updater.beforeRedraw', jsViewOnBeforeRedraw)
							.one('beforestop.updater', function (){
								mailru.uiRadar(mailru.getPageLabel())('request', 1)('onRedraw');
							})
						;
					}
				}
				else {
					mailru.uiRadar(mailru.getPageLabel())('request', 1);
				}
			}
			else if( mailru.isReadMsg ){
				r	= mailru.Messages.hasCache(GET);
				if( !r ){
					mailru.Events
						.unbind('loaded.messages.redraw')
						.one('loaded.messages.redraw', function (){
							documentView.redraw();
						})
					;
				}
			}
			else if( mailru.isComposePage() ){
				r	= mailru.View.Compose.isLoaded();
				if( !r ){
					$(window)
						.unbind('composeformloaded')
						.one('composeformloaded', function (){ documentView.redraw(); })
					;
					mailru.View.Compose.loadFormHtml();
				}
			}

			if( r ){
				if( mailru.isMsgListPage() ){
					__tsMsgList = ajs.now();
				}
				mailru.uiRadar(mailru.getPageLabel())('onRedraw');
			}

			return	r;
		};



		// History listener
		var _part;
		var _first	= true;
		var _hash 	= jsHistory.normalizeUrl( jsHistory.get() );
		var _scrollhash = mailru.v2 && _hash;

		documentView.onRedraw = function (){
			if( mailru.isMsgList ){
				mailru.uiRadar('msglist')('onRedraw', 1)('all', 1)(true);
				if( __tsMsgListLog ){
					var dt = ajs.now()-__tsMsgList, browser = $.browser.name;

					if( browser == 'opera' ){
						browser	+= '_'+ ($.browser.intVersion > 9 ? 10 : 9);
					}
					else if( browser == 'msie' ){
						browser	+= '_'+ ($.browser.intVersion < 8 ? 7 : $.browser.intVersion);
					}

					mailru.radar('mailru_UI_msglist_'+mailru.messagesPerPage, browser+'='+dt, dt);
					__tsMsgListLog = false;
				}
			}

			if( _scrollhash != jsHistory.normalizeUrl( _hash ) ){
				_scrollhash = _hash;
				var oTop = $Scroll.top, nTop = $Scroll[_hash];
				if( oTop != nTop ) setTimeout(function (){
					if( !mailru.threads || !mailru.isReadMsgPage() ){
						$Scroll.scrollTop(nTop);
					}
					$Scroll.top = nTop
				}, 5);
			}
		};

		mailru.Folders.isReady			= /msglist/.test(_hash);
		mailru.ReadMsg.ID				= 0;//defined(GET.id, 0);
		mailru.ReadMsg.View.isActive	= function (){ return mailru.isReadMsg; };

		jsHistory.change(function (hash, isSet, data, local){
			if( mailru.needReloadPage('href', hash) ){
				return;
			}

			var
				  nTop	= (!isSet && !$Scroll.fixed && $Scroll[hash]) || 0
				, oTop	= $Scroll.top
//				, part	= hash.match(/([\w_-]+)(\?|$)/i) && RegExp.$1
				, part	= jsHistory.setModifier(hash).replace(/\?.+$/, '')
				, redraw= true
			;

			mailru._updGETVars(hash);
			_parseURL(part);

			if (local) {
				return;
			}


			if( !~_hash.indexOf('search') != !~hash.indexOf('search') ){
				// Если мы ушли или пришли на поиск, то нужно сбросить cache
				mailru.Messages.resetSearchCache();
			}


			$Scroll[_hash]	= oTop;
			$Scroll[hash]	= nTop;

			_hash			= hash;

			if( mailru.isMsgList || mailru.isReadMsg )
				GET.folder = GET.folder >= 0 ? GET.folder : mailru.folderId;


			mailru.folderId		= (GET.folder >= 0 ? GET.folder : mailru.folderId) || 0;

			mailru.messageId	= !!GET.id ? GET.id : 0;
			mailru.messagesPage	= parseInt(!!GET.page ? GET.page : 1, 10) || 1;
			mailru.messagesSort	= !!GET.sortby ? ajs.htmlEncode(GET.sortby) : mailru.messagesSort;

			mailru.Pager.calc();


			timer('redraw');

			mailru.log('history', hash);
			mailru.uiRadar(false);	// clear all radars

			if( !_first ){
				mailru._loadPage(hash);
			}


			if( _first ){
				// It's first run
				if( mailru.isReadMsg ){
					mailru.ReadMsg.View.wrapStatic();
				}
				else if( mailru.isFileSearchPage() ) {
					mailru.Messages.loadFilesSearch( GET );
				}
				else if( mailru.isFilterFolder() ){
					mailru.Messages.loadSearch( GET );
				}

				documentView.redraw();
			}
			//timer('redraw', 1);

			_first	= false;
			//timer('click', 1);
		});


		window.rb_innerhtml = true;
		window.msgListReady	= true;

		$('#MsgListContent,#ReadMsg,#search__result').addClass('mr_toolbar__y');

		// Disable history
		if( mailru.isSearchNoResultPage() ){
			mailru.needReloadPage('build', ajs.now());
		}


		// NEW ROUTER START
		if( !mailru.Router ){
			$R([mailru.v2 ? '{mailru.v2}mailru.App' : '{mailru}mailru.Router'], function (){
				mailru.Router.nav(jsHistory.get());
			});
		}
		else {
			mailru.Router.nav(jsHistory.get());
		}


		// Dispatch event views ready
		jsCore.notify('mailru.ready');

		if (typeof fixedDocumentWrite == 'function')
			fixedDocumentWrite(document);
	}); // Ready


	jsLoader.loaded('{mailru}mailru', 1);

// data/ru/images/js/ru/mailru.js end

// data/ru/images/js/ru/mailru.Router.js start


// data/ru/images/js/ru/Views/mailru.View.Thread.js start


// data/ru/images/js/ru/mailru.Threads.js start


// data/ru/images/js/ru/model/mailru.Thread.js start


/**
	 * @class	mailru.Thread
	 */
	mailru.Thread = mailru.Model.extend({
		url: 'threads/thread',

		defaults: {
			  length: 	1
			, expand: 	[]
			, messages:	[]
		},

		/**
		 * Get folder by id
		 * @return {mailru.Folder}
		 */
		getFolder: function (){
			return	mailru.Folders.getSafe(this.get('folder'));
		}

	});

	jsLoader.loaded('{mailru.model}mailru.Thread', 1);

// data/ru/images/js/ru/model/mailru.Thread.js end

/**
	 * @class	mailru.Threads
	 */
	mailru.Threads = {
		_index:	{},

		model:	mailru.Thread,
		models:	[],


		_rebuildIndex: function (){
			var i = this.models.length;
			this._index	= {};
			while( i-- ){
				this._index[this.models[i].id] = i;
			}
		},


		get: function (id){
			var idx = this._index[id];
			return	this.models[idx];
		},


		create: function (data){
			var model = new this.model(data);
			this.models.push(model);
			this._rebuildIndex();
			return	model;
		},


		merge: function (threads){
			var i = 0, n = threads.length, thread, data;
			for( i; i < n; i++ ){
				data = threads[i];
				if( thread = this.get(data.id) ){
					thread.set(data);
				} else {
					this.create(data);
				}
			}
		},


		remove: function (model){
			this.models	= Array.remove(this.models, model);
			this._rebuildIndex();
		},


		/**
		 * Find thread by id
		 *
		 * @param {Object} data
		 * @param {Function} [fn]
		 * @returns {$.Deferred}
		 */
		find: function (data, fn){
			var
				  id = data.id
				, cacheKey = '__' + id
				, cache = this.get(id)
				, defer = mailru.Threads[cacheKey] || new $.Deferred
			;

			if( cache !== undef && cache.get('length') == cache.get('messages').length ){
				fn && fn(null, cache);
				defer.resolve(cache);
			}
			else if( !mailru.Threads[cacheKey] ){
				mailru.Threads[cacheKey] = defer;

				mailru.API({
					  url:	this.model.prototype.url
					, data:	{ id: id, offset: 0, limit: 25 }
					, complete: function (Res){
						delete mailru.Threads[cacheKey];

						if( Res.isOK() ){
							var data = Res.getData();

							mailru.Threads.merge([data]);
							fn && fn(null, mailru.Threads.get(id));
							defer.resolve(mailru.Threads.get(id))
						}
						else {
							fn && fn(Res);
							defer.reject(Res);
						}
					}
				});
			}

			return	defer.promise();
		},


		toJSON: function (){
			return	ajs.map(this.models, function (model){ return model.toJSON(); });
		}
	};


	jsLoader.loaded('{mailru}mailru.Threads', 1);

// data/ru/images/js/ru/mailru.Threads.js end

// data/ru/images/js/ru/Views/mailru.View.Message.js start


/**
	 * @class	mailru.View.Message
	 */
	mailru.View.Message = ajs.Router.View.extend({
		tplId: '#message_ejs',
		model: new mailru.Message,

		tagName: 'div',
		className: 'js-message-element',

		boundAll: ['_modelOnChange'],

		init: function (){
			this._setModel(this.model);

			// Attachments view controller
			this.attachViewer = new mailru.FullAttachViewer.Viewer();

			// Show hidden images
			this.$el.delegate('[data-click="ImagesAreHidden.show"]', 'click', function (evt){
				$(evt.currentTarget).closest('.js-parent').display(0);
			});


			// < ReceiptInfo
			this.$el.delegate('form[name="ReceiptInfo"]', 'submit', function (evt){
				var $form = $(evt.currentTarget);

				mailru.Ajax({
					  url:		$form.attr('action')
					, data:		$form.toObject()
					, isUser:	true
				});

				$form.closest('.js-receipt').slideUp('fast');
				mailru.Messages.upd(this.request.query.id, { Receipt: 0 });

				evt.preventDefault();
			}.bind(this));


			this.$el.delegate('[data-click="ReceiptInfo.submit"]', 'click', function (evt){
				$(evt.currentTarget).closest('form').submit();
				evt.preventDefault();
			});
			// ReceiptInfo >


			// < Go to attachment list
			this.$el.delegate('[data-click="message.attaches"]', 'click', function (evt) {
				var offset = this.$('.js-attchments-list').offset();
				if( offset ){
					$ScrollElement.animate({ scrollTop: offset.top }, 'slow', 'easeOutExpo');
				}
				evt.preventDefault();
			}.bind(this));
			// Go to attachment list >


			/*
			// < remove, spam, nospam
			ajs.click('message.remove', function (evt){
				mailru.Events.fire('move.click', mailru.Folder.TRASH);
				evt.preventDefault();
			});

			ajs.click('message.mark.spam', function (evt){
				mailru.Events.fire('spam.click', 'spamabuse');
				evt.preventDefault();
			});

			ajs.click('message.mark.nospam', function (evt){
				mailru.Events.fire('spam.click', 'nospam');
				evt.preventDefault();
			});
			*/

			this.$el.delegate('[data-click="message.mark.flag"]', 'click', function (evt){
				var msg = this.model;
				msg.set({ Flagged: +!msg.Flagged }).save();

				evt.preventDefault();
			}.bind(this));
			// remove, spam, nospam >


//			this.$el.delegate('.answerbar__link', 'click', function (evt){
//				evt.preventDefault();
//			});


			// < counters
			this.$el
				.delegate('[data-link-name]', 'mousedown', function (evt){
					var name = $(evt.currentTarget).attr('data-link-name');
					$(window).triggerHandler('actionLinkClick.readmsg', [name]);
				})
				.delegate('[data-dropdown-link-name]', 'mousedown', function (evt){
					var name = $(evt.currentTarget).attr('data-dropdown-link-name');
					$(window).triggerHandler('dropDownLinkClick.msglist', ['more',  [0, 0, name]]);
				})
			;
			// counters >


			// < blockquote
			// https://jira.mail.ru/browse/MAIL-9357
			this.$el.delegate('.js-blockquote-ctrl', 'click', function (evt){
				var
					  $ctrl = $(evt.currentTarget)
					, cnExpanded = 'b-blockquote_expand'
					, $block = $ctrl.closest('.js-blockquote').toggleClass(cnExpanded)
				;

				$ctrl.html(Lang.get('readmsg.blockquote.ctrl')[+$block.hasClass(cnExpanded)]);
				evt.preventDefault();
			});
			// blockquote >


			// < anchors
			jsHistory.change(function (hash){
				var anchor = ajs.toObject(hash)._;
				try { anchor = decodeURIComponent(anchor) } catch (e){ anchor = unescape(anchor); }
				if( anchor && anchor !== this.__anchor ){
					this._scrollTo('a[name="'+anchor+'"]', -30);
				}
				this.__anchor = null;
			}.bind(this));
			// anchors >
		},


		_setModel: function (model){
			this.model.off('change', this._modelOnChange);
			this.model = model.on('change', this._modelOnChange);
		},


		_modelOnChange: function (){
			var $flag = this.$('.js-flag'), msg = this.model;
			$flag.toggleClass('mr_read__flag_y', !!msg.Flagged);
		},


		_iToolbar: function (){
			if( this.viewDropDown ){
				this.viewDropDown.destroy();
				this.viewSpamBtns.destroy();
			}

			this.viewDropDown = new mailru.View.Folders.DropDown({
				  idView:		this.el
				, cssElms:		'.dropdown'
				, clSel:		'dropdown__list__item_disabled'
				, clLink:		'dropdown__button, .dropdown__checkbox'
				, clContainer:	'dropdown__list'
				, isActive:		function (){ return this._active() }
			});

			this.viewSpamBtns = new mailru.View.Folder.SpamButtons({
				  idView:	this.$('.js-spam')
				, isActive:	function (){ return this._active() }
			});

			this.viewDropDown.redraw();
			this.viewSpamBtns.redraw();
		},


		_scrollTo: function (el, offset){
			var top	= this.$(el).offset();
			if( top && (top = top.top + offset) ){
				$ScrollElement.animate({ scrollTop: top }, 'slow', 'easeOutExpo');
			}
		},


		_getFormattedBody: function (msg){
			var body = msg.getBody();
			return	mailru.Utils.Message.prepareBlockquote(body);
		},


		loadData: function (req){
			if( !mailru.Messages.hasCache(req.query) ){
				var df = $.Deferred();

				mailru.Events
					.unbind('loaded.messages.'+this.uniqId)
					.bind('loaded.messages.'+this.uniqId, function (){
						if( mailru.Messages.hasCache(req.query) ){
							this._setModel(mailru.Messages.get(req.query));
							mailru.Events.unbind('loaded.messages.'+this.uniqId);
							df.resolve();
						}
					}.bind(this))
				;

				return	df;
			}
		},


		onRouteStart: function (){
			$Scroll.scrollTop(0);
			$(window).triggerHandler('showMessage.readmsg');
		},


		onRoute: function (){
			this.render();
		},


		render: function (){
			var req = this.request;
			var msg	= this.model;

			if( msg ){
				this.$el.tpl(this.tplId, {
					  msg:		msg
					, folder:	this.folder || msg.getFolder()
					, thread:	this.thread
					, messageBody: this._getFormattedBody(msg)

					// options
					, options: this.options || {}

					, $URL:		req
					, $GET:		req.query
				});

				this._iToolbar();

				// build attachments view
				this.attachViewer.redraw(this.$('.js-attachments-view'), this.model.toJSON());
			}
		},


		destory: function (){
			if( this.viewDropDown ){
				this.viewDropDown.destroy();
				this.viewSpamBtns.destroy();
			}

			this.attachViewer.destroy();

			this.$el.unbind().undelegate();
			this.model.off('change', this._modelOnChange);
		}
	});


	ajs.loaded('{mailru.view}mailru.View.Message');

// data/ru/images/js/ru/Views/mailru.View.Message.js end

/**
	 * @class	mailru.View.Thread
	 */
	mailru.View.Thread = ajs.Router.View.extend({
		el: '#ReadMsg',

		model: null,
		collection: mailru.Threads,

		boundAll: ['modelOnChange'],


		init: function (){
			this.views = [];
			this.autoload = true;


			var $anchor = $('#js-message-foot-anchor');
			var toolbarTop = $('#AdvertisingTopLine').offset().top + $('#AdvertisingTopLine').height() + 2;

			$Scroll.scroll(function() {
				var
					  offset = $anchor.offset()
					, scrollTop = ajs.scrollTop()
					, fixed = scrollTop > toolbarTop
				;

				if( 0 && this._toolbarFixed !== fixed ){
					this._toolbarFixed = fixed;

					if( !this._$toolbarEl ){
						this._$toolbarEl = this.$('.toolbar');
					}

					var $el = this._$toolbarEl, pad = parseInt($el.css('paddingLeft'), 10) + parseInt($el.css('paddingRight'), 10);

					if( !this._$toolbarClone ){
						this._$toolbarClone = $el.clone().insertBefore($el).css('visibility', 'hidden');
					}

					this._$toolbarClone.display(fixed);

					$el.css({
						  top:		fixed ? 0 : ''
						, width:	fixed ? this.$el.width() - pad : ''
						, zIndex:	fixed ? 1e5 : ''
						, position:	fixed ? 'fixed' : ''
					});
				}

				// autoload by scroll
				if( offset && (offset.top - scrollTop - ajs.windowHeight() < 200) && this.autoload ){
					if( this.messages.length ){
						this.autoload = false;
						$('#js-message-foot-loading').display(1);

						mailru.Messages.load({ id: this.messages.shift().id }, function (err, msg){
							this.autoload = true;
							$('#js-message-foot-loading').display(0);

							if( !err ){
								this.render(msg, {
									  disabledHead: true
									, disabledFoot: true
								});
							}

							$Scroll.trigger('scroll');
						}.bind(this));
					}
				}
			}.throttle(150, this));
		},


		setModel: function (model){
			if( this.model ) this.model.off('change', this.modelOnChange);

			if( model !== this.model ){
				this.model		= model.on('change', this.modelOnChange);
				this.messages	= [].concat(model.get('messages'));
			}
		},


		modelOnChange: function (model){
			var length = model.get('length') - model.prev('length');
			if( length > 0 ){
//				this.loadData(this.request);
			}
		},


		readThread: function (){
			var model = this.model;
			if( model.get('unread') ){
				model.set('unread', false);
				mailru.Messages.edit('read', model.id);
			}
		},


		loadData: function (req){
			var df = $.Deferred();

			mailru.Threads.find(req.query, function (err, model){
				if( err ){
					df.reject();
				} else {
					this.setModel(model);

					mailru.Messages.load({ id: this.messages[0].id }, function (err){
						this.readThread();
						df[err ? 'reject' : 'resolve']();
					}.bind(this));
				}
			}.bind(this));

			return	df;
		},


		onRouteStart: function (){
			this.onRouteChange();
		},


		onRouteChange: function (){
			// Render first message in thread
			var id = this.messages.shift().id;
			if( id ){
				var msg = mailru.Messages.get(id);

				this.clean();
				this.render(msg, { disabledFoot: true });
			}
		},


		onRouteEnd: function (){
			this.clean();
			// Set dummy model
			this.setModel(new mailru.Thread);
		},


		render: function (msg, opts){
			var msgView = new mailru.View.Message({
				  model:	msg
				, thread:	this.model
				, folder:	this.model.getFolder()
				, inited:	true
				, request:	this.request
				, options:	opts
			});

			msgView.render();

			this.views.push(msgView);
			this.$el.append(msgView.$el);

			$Scroll.trigger('scroll');
		},


		clean: function (){
			var view;
			while( view = this.views.pop() ){
				view.destory();
				view.$el.remove();
			}
		}

	});


	jsLoader.loaded('{mailru.view}mailru.View.Thread', 1);

// data/ru/images/js/ru/Views/mailru.View.Thread.js end

// data/ru/images/js/ru/Views/mailru.View.LeftFolders.js start


/**
	 * @class mailru.View.LeftFolders
	 * @contributor Alexander Abashkin <a.abashkin@corp.mail.ru>
	 */
	mailru.View.LeftFolders = ajs.Router.View.extend({
		el: '#leftcol__folders',
		singleton: true,

		init: function (){
			this.render = this.render.bind(this);

			mailru.Events.bind('updated.folder update.folders', this.render);

			$('#row_link_to_unread a').mousedown(function () {
				$(window).triggerHandler('folderUnreadLinkClick.folders');
			});

			this.$el
				.delegate('.js-folder-clear', 'click', function (evt){
					var $link = $(evt.currentTarget), folderId = $link.attr('data-id');
					if( this._clearFolder(folderId, $link) ){
						$(window).triggerHandler('folderLinkClick.folders', [folderId]);
						return false;
					}
				}
				.bind(this))

				.delegate('.js-folder-clear', 'hover', function (evt){
					$(evt.currentTarget).toggleClass('menu__item__link__clear_hover', evt.type == 'mouseenter');
				}.bind(this))
				.delegate('.mr_menu_fld_options_link', 'mousedown', function (){
					$(window).triggerHandler('folderSettingsLinkClick.folders');
				})
				.delegate('.mr_menu_fld_mrim', 'mousedown', function (){
					$(window).triggerHandler('folderMRIMArchLinkClick.folders');
				})
			;

			$('#leftcol__msglist')
				.delegate('.js-mailru_v2-on', 'click', function (evt) {
					evt.preventDefault();
					new Image().src = '//rs.' + mailru.SingleDomainName + '/sb1690155.gif?' + Math.random();
					mailru.Balloon.updateStatus(mailru.HelperIndex.mailru_v2, function () {
						location.reload();
					});
				})
				.delegate('.js-mrim-link', 'mousedown', function () {
					mailru.radar('MR_LINK', 'click=1');
				})
			;

			this.toggleFolders();
		},

		loadData: function (req){
			var
				  params = req.params
				, folderId = (params.name ? (mailru.Folder[params.name.toUpperCase()] || params.id) : req.query.folder) || 0
				, page = Math.max(parseInt(req.query.page, 10), 1)
				, df
			;

			// Set current folder id
			this.folderId = folderId;

			if( mailru.isReadMsgPage(req.path) ){
				df = mailru.Folders.findByMsgId(params.id || req.query.id, true).done(function (folder){
					this.folderId = folder.id;
				}.bind(this));
			}
			else if( !mailru.Folders.hasCache(folderId, page) ){
				df = $.Deferred();

				if( mailru.isMsgListPage(req.path) ){
					mailru.Events.unbind('stop.updater.'+this.uniqId).one('stop.updater.'+this.uniqId, function (){
						if( mailru.Folders.hasCache(folderId, page) ){
							df.resolve();
						} else {
							df.reject();
						}
					});
				}
				else {
					df.resolve();
				}
			}

			return	df;
		},

		onRoute: function (){
			var active = mailru.isMsgListPage() || mailru.isReadMsgPage(); // Оло-ло!

			if( (this.__folderId === undef) || (this.__active !== active) || (this.__folderId !== this.folderId) ){
				this.__active	= active;
				this.__folderId	= this.folderId;
				this.render();
			}
		},

		onRouteEnd: function (){
			delete this.__active;
			delete this.__folderId;
		},

		render: function (){
			var active = mailru.isMsgListPage() || mailru.isReadMsgPage();

			this.$el.tpl('#leftcol__folders_ejs', {
				  activeId: active ? this.folderId : 'null'
				, folders:  mailru.Folders.getAll()
			});
		},

		_clearFolder: function (folderId, $link){
			var folder = mailru.Folders.getSafe(folderId);

			if( folder.isSecureOpen() ){
				$R('{mailru'+'.ui}mailru.ui.TipOfTheDay', function() {
					$link.TipOfTheDay({
						'maxShow': -1,
						'hideBy': 'body:mousedown',
						'orientation': 'bottom',
						'positionX': 'left',
						'html': '<div class="icon-wrap icon-wrap_balloon"><i class="icon icon_balloons icon_lamp"></i></div><div class="balloon__message">'
								+ '<div><b>' + Lang.get('eventfolders.clear_folder') + ' &laquo;' + ajs.Html.escape(folder.Name) + '&raquo;?</b></div><div style="margin:1px 0 3px; color:#5e6061;">'
								+ Lang.get('eventfolders.confirm.remove_forever') + '</div><div><span class="button-a js-clearButton">'
								+ Lang.get('eventfolders.clear') + '</span></div></div>',
						'onInit': function() {
							var t = this;
							$('.js-clearButton', t.$Balloon.find(t.cssTH)).click(function () {
								t._eHide();

								$(window).trigger('folder-clear-status', [folderId, 'start']);

								mailru.Ajax({
									url: "/cgi-bin/clearfolder",
									type: "POST",
									data: {
										ajax_call: 1,
										func_name: 'clear_folder',
										folder: folderId
									},
									isUser: true,
									complete: function (R){
										$(window).trigger('folder-clear-status', [folderId, 'end']);

										if( R.isOK() ){
											if( mailru.isReadMsgPage() && (folderId == mailru.getFolderId()) ){
                                                var url = '/messages', id = folderId;
                                                switch (parseInt(id,10)) {
                                                    case 0      : url += '/inbox'; break;
                                                    case 950    : url += '/spam'; break;
                                                    case 500000 : url += '/sent'; break;
                                                    case 500001 : url += '/drafts'; break;
                                                    case 500002 : url += '/trash'; break;
                                                    case 500003 :
                                                    case 500005 : url = '/agent/archive'; break;
                                                    default     : url += '/folder/' + id;
                                                }
												jsHistory.set(url);
											}

											folder.set({ Messages: 0, Unread: 0 });

											mailru.Messages.set(folderId, [], ajs.now());
											mailru.View.Messages.getActive().redraw();
											$(window).trigger('folder-clear-status', [folderId, 'done']);
											mailru.Updater.reload();
										}
									}
								});
							});
						}
					}); // TipOfTheDay
				});

				return true;
			}
		},

		toggleFolders: function() {
			var menu = this.$el;

			// Open folder group by click
			menu.delegate('.js-nav__group', 'click', function(event) {
				var target = $(event.currentTarget);
				var opened = 'b-nav__group_open';

				// if there're no subfolders
				if (target.data('empty')) {
					return 0;
				}

				if (!target.hasClass(opened)) {
					var url = '/messages', id = (target.data('id') || 0);
					switch (parseInt(id,10)) {
						case 0      : url += '/inbox'; break;
						case 950    : url += '/spam'; break;
						case 500000 : url += '/sent'; break;
						case 500001 : url += '/drafts'; break;
						case 500002 : url += '/trash'; break;
						case 500003 :
						case 500005 : url = '/agent/archive'; break;
						default     : url += '/folder/' + id;
					}

					jsHistory.set(url);
				}

				var arrow = $(event.target).is('.b-nav__item__arrow__box, .b-nav__item__arrow');

				target[arrow ? 'toggleClass' : 'addClass'](opened)
					.siblings().removeClass(opened);


				var name = target.find('.b-nav__item__text');

				// Remove fade effect for the newest empty collectors
				if (name.hasClass('b-nav__group_fade')) {
					name.removeClass('b-nav__group_fade');
				}
			});
		}
	});

	jsLoader.loaded('{mailru.view}mailru.View.LeftFolders', 1);

// data/ru/images/js/ru/Views/mailru.View.LeftFolders.js end

// data/ru/images/js/ru/Views/mailru.View.MsgListContent.js start


/**
	 * @class mailru.View.MsgListContent
	 */
	mailru.View.MsgListContent = mailru.View.LeftFolders.extend({
		el: '#MsgListContent',
		singleton: true,

		init: function (){
			var t = this;

			$('#ajax-alt-special-folder').delegate('.js-folder-clear', 'click', function (evt){
				var
					  F = mailru.Folders.get( $(evt.currentTarget).data('id') )
					, txt = Lang.get('folder.clear.confirm')
				;

				if( F && confirm((txt[F.getType()] || txt.def).replace('%s', F.Name)) ){
					t.clearProcessStatus(F.Id, 'start');

					mailru.Ajax({
						url: '/cgi-bin/clearfolder',
						type: 'POST',
						data: {
							ajax_call: 1,
							func_name: 'clear_folder',
							folder: F.Id
						},
						isUser: true,
						complete: function (R) {
							t.clearProcessStatus(F.Id, 'end');

							if( R.isOK() ){
								mailru.Updater.reload(true);
								mailru.Messages.set(F.Id, [], now(), 0);
								mailru.View.Messages.getActive().redraw();
								t.clearProcessStatus(F.Id, 'done');
							}
						}
					});
				}

				return	false;
			});

			$(window).bind('folder-clear-status', function (evt, folderId, status){
				this.clearProcessStatus(folderId, status);
			}.bind(this));

			this.on('routestart routeend', function (evt){
				this.$el.display(evt.type != 'routeend');
			}.bind(this));
		},


		clearProcessStatus: function (id, status){
			var $Alt = $('#ajax-alt-special-folder-'+id).add('#folder'+id);

			if( status == 'start' ){
				$('.js-folder-clear,.js-folder-clear-ok', $Alt).display(0);
				$('.js-folder-clear-loading', $Alt).display(1);
			}
			else if( status == 'end' ){
				$('.js-folder-clear', $Alt).display(1);
				$('.js-folder-clear-loading', $Alt).display(0);
			}
			else {
				$('.js-folder-clear', $Alt).display(0);
				$('.js-folder-clear-ok', $Alt).display(1);
			}
		},


		render: function (){
			var
				  Folder = mailru.Folders.getSafe(this.folderId)
				, isEmpty = !Folder.Messages
				, isSent = Folder.isSent() || Folder.isDrafts()
				, title = (Folder.isRoot() ? '' : Folder.getRoot().Name + ' / ') + Folder.Name
			;

			// Set folder title
			this.$('#id-folder-name').innerHTML(ajs.Html.escape(title));

			// Sender
			this.$('.ajax-add-sender').display(!isSent);

			$('DIV', '#ajax-alt-special-folder').display(0);
			$('#ajax-alt-special-folder-'+Folder.Id)
				.display(1)
				.find('.js-folder-clear').display(!isEmpty).end()
				.find('.js-folder-clear-ok').display(0).end()
			;
		}
	});


	jsLoader.loaded('{mailru.view}mailru.View.MsgListContent', 1);

// data/ru/images/js/ru/Views/mailru.View.MsgListContent.js end

(function (Router){
		mailru.View.MsgListLeftCol = ajs.Router.View.extend({
			el: '#leftcol__msglist',
			singleton: true
		});


		mailru.View.ReadMsgContent = ajs.Router.View.extend({
			el: '#ReadMsg',
			singleton: true,

			loadData: function (req){
				var params = req.params.id ? req.params : req.query;

				if( !mailru.Messages.hasCache(params) ){
					var df = $.Deferred();
					mailru.Events
						.unbind('loaded.messages.'+this.uniqId)
						.bind('loaded.messages.'+this.uniqId, function (){
							if( mailru.Messages.hasCache(params) ){
								mailru.Events.unbind('loaded.messages.'+this.uniqId);
								df.resolve();
							}
						}.bind(this))
					;
					return  df;
				}
			},

			onRouteStart: function (){
				$Scroll.scrollTop(0)
			}
		});


		mailru.View.SentMsgContent = ajs.Router.View.extend({
			el: '#MailRuSentMsg',
			loadData: function (){
				var df = $.Deferred();
				mailru.View.Compose.loadFormHtml('', df.resolve);
				return	df;
			}
		});


		mailru.View.SearchContent = ajs.Router.Unit.extend({
			loadData: function (req){
				if( !mailru.Messages.hasSearchCache(req.query) ){
					var df = $.Deferred();
					mailru.Events
						.unbind('loaded.search.loadData')
						.one('loaded.search.loadData', df.resolve)
					;
					return	df;
				}
			}
		});


		mailru.View.FileSearchContent = ajs.Router.Unit.extend({
			loadData: function (req){
				if( !mailru.Messages.hasFilesSearchCache(req.query) ){
					var df = $.Deferred();
					mailru.Events
						.unbind('loaded.fileSearch.loadData')
						.one('loaded.fileSearch.loadData', df.resolve)
					;
					return	df;
				}
			}
		});



		/**
		 * New routing
		 */
		Router
			.route(/(compose|message|agent)/, mailru.View.MsgListLeftCol)

			.route('/messages/:name([a-z]+)?/:id?', mailru.View.LeftFolders)
			.route('/messages/:name([a-z]+)?/:id?', mailru.View.MsgListContent)
			.route('/messages/spam', {
				onRoute: function() {
					// https://jira.mail.ru/browse/MAIL-14858
					Counter.d(mailru.HideSpamCounterOnTheLeftCol ? 1563666 : 1563661);
				}
			})

			.route('/message/*', mailru.View.LeftFolders)
			.route('/message/:id', mailru.View.ReadMsgContent)

			.route('/compose*', mailru.View.LeftFolders)
			.route('/compose/:mode?', mailru.View.SentMsgContent)
			.route('/compose/:id/:mode', mailru.View.SentMsgContent)

			.route('/search/', mailru.View.SearchContent)
		;




		/**
		 * Old routing
		 */
		/* SentMsg/Compose page */
		Router.createGroup('*sentmsg')
			.route('.', mailru.View.MsgListLeftCol)
			.route('.', mailru.View.LeftFolders)
			.route('.', mailru.View.SentMsgContent)
		; // sentmsg


		/* SendMsgOk page */
		Router.createGroup('*sendmsgok')
			.route('.', mailru.View.MsgListLeftCol)
			.route('.', mailru.View.LeftFolders)
			.route('.', ajs.Router.View, { el: '#MailRuSentMsgOk' })
		; // sentmsg, sendmsgok


		/* Msglist page */
		Router.createGroup('*msglist')
				.route('.', mailru.View.MsgListLeftCol)
				.route('.', mailru.View.LeftFolders)
				.route('.', mailru.View.MsgListContent)
				.route('.', {
					onRoute: function() {
						// https://jira.mail.ru/browse/MAIL-14858
						if( mailru.Folders.getSafe().id == 950) {
							// spam folder
							Counter.d(mailru.HideSpamCounterOnTheLeftCol ? 1563666 : 1563661);
						}
					}
				})
		; // msglist


		/* Readmsg page */
		Router.createGroup('*readmsg')
			.route('.', mailru.View.MsgListLeftCol)
			.route('.', mailru.View.LeftFolders)
			.route('.', mailru.View.ReadMsgContent);
		// readmsg


		/* Search page */
		Router.createGroup('*gosearch').route('.', mailru.View.SearchContent);


		/* FileSearch page */
		Router.createGroup('*filesearch').route('.', mailru.View.FileSearchContent);





		Router.on('route', function _tmp(){
			/**
			 * Ignore the first "onRoute"
			 */
			Router.on('beforeroute', function (evt, req){
				mailru._updGETVars(req.url);

				if( mailru.isReadMsgPage(req.path) ){
					var id	= (req.path.match(/message\/(\d+)/) || [0, req.query.id])[1];
					var msg	= mailru.Messages.get(id);

					if( msg && msg.Unread ){
						mailru.Updater.abort();
					}
					else if( !mailru.Updater.active ){
						mailru.Updater.reload(true);
					}
				}
			});

			// Radar
			Router.off('route', _tmp);
			Router.on('route', function (evt, req, mSec){
				var path = req.path.split('/').pop();
				mailru.radar('router', path+'='+mSec);
			});
		});
	})(mailru.Router = new ajs.Router);

	jsLoader.loaded('{mailru}mailru.Router', 1);

// data/ru/images/js/ru/mailru.Router.js end

// data/ru/images/js/ru/ui/mailru.ui.FileSearchPreview.js start


(function () {
		var
			  _pid
			, $Layer    = $('<div class="msglist__preview msglist__preview_layer"></div>')
			, $Fade     = $('<div></div>').css({ backgroundColor: '#000', opacity: .6, position: 'absolute', zIndex: 1900, top: 0, left: 0, width: '100%', height: '100%' })
			, _loading  = '<span class="icon icon_loader"></span>'
		;


		/**
		 * @class   mailru.ui.FileSearchPreview
		 */
		ajs.createClass('mailru.ui.FileSearchPreview');


		/**
		 * Wrap view
		 *
		 * @namespace mailru.ui.FileSearchPreview
		 * @param {String} selector
		 */
		mailru.ui.FileSearchPreview.wrap = function (selector){
			$(selector)
				.delegate('.js-msg', 'mouseenter mouseleave', _preview)
				.delegate('.js-preview', 'click', _fullScreen)
			;
		};


		function _preview(evt){
			var $node = $(evt.currentTarget), over = evt.type != 'mouseleave', isPreviewable = false, isDocs = false;

			clearTimeout(_pid);

			if( !$node[0].__preview ){
				_pid = setTimeout(function (){
					$node[0].__preview = true;

					if($node.find('.icon_filetype_picture')[0]) {
						isPreviewable = true;
					}
					else if ((mailru['MRVMSDocPreview'] || mailru['MRVMSPptPreview'] || mailru['MRVMSExcelPreview']) && $node.find('.icon_filetype_doc, .icon_filetype_docx, .icon_filetype_xls, .icon_filetype_xlsx, .icon_filetype_ppt, .icon_filetype_pptx')[0]) {
						isPreviewable = true;
						isDocs = true;
					}

					if (isPreviewable) {
						$('<div class="js-preview msglist__preview msglist__preview_image"></div>')
							.append(_loading)
							.css({ marginLeft: 0, opacity: 0 })
							.prependTo($node)
						;

						_preload($node.find('.js-preview'), $node.find('.messageline__body__link_filename').attr('href'), isDocs);
					}

					_toggle($node, over);
				}, 500);
			}

			_toggle($node, over);
		}


		function _preload($node, url, isDocs){
			var q = ajs.toObject(url),
				file_id = q._av ? q._av : q.id,
				src = '//apf.' + (mailru.SingleDomainName || 'mail.ru') + '/cgi-bin/readmsg/'+q.file+'?af_preview=1&id='+file_id;

			url = '/cgi-bin/getattach?file='+q.file+'&id='+file_id+'&mode=attachment&type=&channel=';

			if (isDocs) {
				src = '//docs.' + mailru.SingleDomainName + '/preview/206x206/?src=' + encodeURIComponent(document.location.protocol + '//' + mailru.MainMailHost + url);
			}

			if( /win.dev/.test(location.host) ){
				src = '//ima64.dev.mail.ru/cgi-bin/readmsg/'+q.file+'?af_preview=1&mode=attachment&id='+file_id;
			}

			_redrawPreview($node.data({
				  'url': url
				, 'preview': src
			}));

			$(new Image)
				.load(function (){
					$(this).unbind();

					var size	= _getSize(this.width, this.height, 200, 300);
					this.width	= size[0];
					this.height	= size[1];
					_redrawPreview($node.empty().append(this), size[0]+16, size[1]+16);
				})
				.attr('src', src)
			;
		}


		function _fullScreen(evt){
			var url = $(evt.currentTarget).data('url');
			_layer(100, 100);
			$(new Image)
				.load(function (){
					$(this).unbind();
					_layer(this.width, this.height, this);
				})
				.attr('src', url)
			;
			evt.preventDefault();
		}


		function _layer(w, h, content){
			if( !$Layer._ready ){
				$Layer._ready = true;
				$('body').append($Fade, $Layer);
				$Fade.click(function (){ $Layer.click(); });
				$Layer.click(function (){
					$Fade.hide();
					$Layer.hide();
				});
			}

			var size = _getSize(w+16, h+16, ajs.windowWidth()-50, ajs.windowHeight()-50);

			$Fade.show();
			$Layer.show().empty().css({
				  left:     (ajs.windowWidth() - size[0])/2
				, top:      (ajs.windowHeight() - size[1])/2
				, width:    size[0]
				, height:   size[1]
			});

			if( !content ){
				$Layer.append(_loading);
			} else {
				$(content)
					.css({ width: size[0]-16, height: size[1]-16 })
					.appendTo($Layer)
				;
			}

			var $Item = $Layer.children();
			$Item.css({ marginTop: -$Item.height()/2, marginLeft: -$Item.width()/2 });
		}


		function _getSize(w, h, mW, mH){
			mW = Math.min(w, mW);
			mH = Math.min(h, mH);

			if( w > mW ){
				h   = mW*(h/w);
				w   = mW;
			}

			if( h > mH ){
				w   = mH*(w/h);
				h   = mH;
			}
			return [w, h];
		}

		function _toggle($node, s){
			$node.find('.js-preview')[s ? 'show' : 'F']().dequeue().animate({
				  opacity:      +s
				, marginLeft:   s*5
			}, 'fast', s ? $.noop : _hide);
		}

		function _hide(){
			$(this).hide();
		}

		/**
		 * @param $node
		 * @param [width]
		 * @param [height]
		 */
		function _redrawPreview($node, width, height){
			width   = width || $node.innerWidth();
			height  = height || $node.innerHeight();

			$node[arguments.length > 1 ? 'animate' : 'css']({
				  top:      ($node.parent().height() - height)/2
				, left:     -width
				, width:    width
				, height:   height
			}, 'fast');
		}

		jsLoader.loaded('{mailru.ui}mailru.ui.FileSearchPreview', 1);
	})();

// data/ru/images/js/ru/ui/mailru.ui.FileSearchPreview.js end

// 53
	jsLoader.loaded('{mailru.build}MsgList', 0);

})(jQuery, jQuery);

// data/ru/images/js/ru/build/MsgList.js end
