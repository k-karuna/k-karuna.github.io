/* 2013-08-26 11:38:45 */


// data/ru/images/js/ru/build/Settings.js start

if( 'jQuery' in window ) (function (jQuery, $) {

// @build
// @build-exclude: build/core.js
// @build-jquery
// @build-minify
// @deploy-wait-for: http://js.imgsmail.ru/u/js/ru/build/Settings.js

// data/ru/images/js/ru/ui/mailru.ui.Options.js start

/**
 * @object  mailru.ui.Options
 * @author  Artem Sapegin  <artem@sapegin.ru>
 */


// data/ru/images/js/ru/ui/mailru.ui.SnappingPanel.js start

/**
 * @object  mailru.ui.SnappingPanel
 * @author  Artem Sapegin  <artem@sapegin.ru>
 * @author  Stanislav Tugovikov  <s.tugovikov@corp.mail.ru>
 * @author  Alexander Abashkin  <a.abashkin@corp.mail.ru>
 */


(function (){
		jsClass.create('mailru.ui.SnappingPanel').statics({
			snapScrollToTop: function() {
				var panel = new mailru.ui.SnappingPanel({
					panel: $('.leftcol__snapping-panel'),
					floatingClass: 'leftcol__snapping-panel_floating',
					direction: 'up',
					insideBody: false
				});

				panel.startSnapping();
			},

			snapFormActions: function() {
				var footer = $('.form__actions');

				var panel = new mailru.ui.SnappingPanel({
					panel: footer,
					floatingClass: 'form__actions_floating',
					direction: 'down',
					insideBody: true
				});

				(function() {
					var form = footer.closest('form');

					form.bind('destroy.view', function() {
						panel.destroy();
					});

					form.bind('reset', function() {
						panel.stopSnapping();
					});

					footer.find('input[type="submit"]').click(function() {
						form.submit();
						return false;
					});

					function _checkDataChange() {
						form.delegate('input,select,textarea', 'change input keydown', _dataChanged);
						form.delegate('.form__dropdown__item', 'click', _dataChanged);
					}

					function _dataChanged(e) {
						panel.startSnapping();
					}

					_checkDataChange();
				})();
			},

			snapToolbar: function() {
				var panel = new mailru.ui.SnappingPanel({
					panel: $('.toolbar-wrapper-placeholder .toolbar-wrapper-snapping'),
					floatingClass: 'toolbar-wrapper-snapping_floating',
					direction: 'up',
					insideBody: false
				});

				panel.startSnapping();
			}

		}).methods({
			__construct: function(params) {
				this.canSnapping   = false;

				if (!params.panel.length) {
					return;
				}

				$E(this, params);

				this.placeholder = this.panel.parent();

				this.placeholder.height(this.panel.height());

				this._initSnappingPanel();
			},

			destroy: function() {
				this.stopSnapping();
				this.panel.remove();
			},

			startSnapping: function() {
				if (!this.panel) {
					return;
				}

				this.canSnapping = true;
				this._checkPanel();
			},

			_display: function(action) {
				setTimeout(function() {
					this.panel[action + 'Class'](this.floatingClass);
				}.bind(this), 0);
			},

			stopSnapping: function() {
				this.canSnapping = false;
				this._checkPanel();
			},

			_initSnappingPanel: function() {
				if (!document.body.getBoundingClientRect) {
					return;
				}

				$(window).bind('scroll resize start__snapping', this._checkPanel.throttle(10, this));
				this._checkPanel();
			},

			_checkPanel: function() {
				var cssClass = this.floatingClass;
				var panel = this.panel;

				if (this._needToSnap()) {
					if (!panel.hasClass(cssClass)) {
						if(this.insideBody) {
							$('body').append(panel);
						}

						this._display('add');
					}

				} else {
					if (panel.hasClass(cssClass)) {
						if(this.insideBody) {
							this.placeholder.append(panel);
						}

						this._display('remove');
					}
				}
			},

			/**
			 * Is snapping panel needs to snap (not in viewport + viewport is above panel)
			 */
			_needToSnap: function() {
				if (!this.canSnapping) {
					return false;
				}

				var placeholder = this.placeholder[0];
				var rect = placeholder.getBoundingClientRect();

				switch(this.direction) {
					case 'up':
						return  rect.top < 0;

					case 'down':
						return rect.top >= 0 && !(rect.top >= 0 && rect.bottom <= $(window).height());
				}
			}
		});
	})();


	jsLoader.loaded('{mailru.ui}mailru.ui.SnappingPanel', 1);

// data/ru/images/js/ru/ui/mailru.ui.SnappingPanel.js end

(function (){
		var ui = {
			init: function() {
				mailru.ui.SnappingPanel.snapFormActions();
			},

			initWysiwyg: function(container) {
				this.closeActiveWysiwyg();

				if (container.data('wysiwyg')) {
					setTimeout(function() {
						container.data('wysiwyg').focus();
					}, 100);
					return;
				}

				var id = container.data('id') !== undefined ? container.data('id') : '';
				var options = {
					'mode': 'exact',
					'elements': 'Editor' + id,
					'auto_focus': 'Editor' + id,
					'width': '558',
					'height': '102',
					'doctype': '',
					'language': 'ru',
					'language_load': false,
					'theme': 'compose',
					'add_form_submit_trigger': false,
					'submit_patch': false,
					'convert_fonts_to_spans': false,
					'add_unload_trigger': false,
					'cleanup': false,
					'update_styles': false,
					'keep_values': false,
					'gecko_spellcheck': true,
					'forced_root_block': false,
					'force_br_newlines': true,
					'force_p_newlines': false,
					'remove_linebreaks': false,
					'no_content_load': true,
					'extended_valid_elements': 'style',
					'font_size_style_values': '8px,10px,12px,14px,18px,24px,36px',
					'theme_compose_toolbar_location': 'external',
					'theme_compose_toolbar_external_id': 'Toolbar' + id,
					'theme_compose_toolbar_align': 'left',
					'theme_compose_buttons1': 'bold,italic,underline,forecolor,backcolor,fontactions,justifyselect,textindentactions,emotions,undo,redo,addlink,hr,removeformat',
					'theme_compose_buttons2': '',
					'theme_compose_buttons3': '',
					'theme_compose_buttons4': ''
				};
				tinyMCE.init(options);
				container.data('wysiwyg', tinyMCE.activeEditor);
			},

			closeActiveWysiwyg: function() {
				var activeWysiwyg = $('.js-editor:visible');
				if (!activeWysiwyg.length || !activeWysiwyg.data('wysiwyg')) return;

				var activePlaceholder = activeWysiwyg.closest('.js-editor-contaner').find('.js-editor-placeholder'),
					content = activeWysiwyg.data('wysiwyg').getContent();
				activePlaceholder.find('.js-text').html(content);
				activeWysiwyg.find('textarea').val(content);
				activeWysiwyg.hide();
				activePlaceholder.show();
			},

			syncActiveWysiwyg: function() {
				var activeWysiwyg = $('.js-editor:visible');
				if (!activeWysiwyg.length || !activeWysiwyg.data('wysiwyg')) return;

				activeWysiwyg.find('textarea').val(activeWysiwyg.data('wysiwyg').getContent());
			},

			checkedDropdown: function(opts) {
				opts.container.dropdown({
					link: '.js-link',
					container: '.js-menu',
					openInsideBody: true,
					onToggle: (opts.onToggle ? opts.onToggle : $.noop()),
					onClick: function(e) {
						function check(container) {
							container.find(':checkbox').attr('checked', 'checked');
							container.findWithRoot('.js-dropdown-item:not(.form__dropdown__item_disabled)').addClass('form__checkbox_flat_checked');
						}
						function uncheck(container) {
							container.find(':checkbox').removeAttr('checked');
							container.findWithRoot('.js-dropdown-item').removeClass('form__checkbox_flat_checked');
						}
						function toggle(container, condition) {
							if (condition)
								check(container);
							else
								uncheck(container);
						}

						var item = $(e.target).closest('.js-dropdown-item'),
							menu = item.closest('.js-menu'),
							dropdown = menu.data('dropdown'),
							checkbox = item.find(':checkbox'),
							checked = !checkbox.attr('checked');  // Invert previous state

						toggle(item, checked);

						var all;
						if (checkbox.val() === 'all') {
							all = checked;
							toggle(menu, all);
						}
						else {
							var allCheckbox = menu.find(':checkbox[value="all"]'),
								allItem = allCheckbox.closest('.js-dropdown-item');
							all = menu.find(':checkbox').not(allCheckbox).length === menu.find(':checked').not(allCheckbox).length;
							toggle(allItem, all);
						}

						var selected = [],
							selectedIds = [],
							selectedText;
						menu.find(':checked').each(function() {
							var checkbox = $(this);
							if (checkbox.val() === 'all') return;
							selected.push($.trim(checkbox.closest('.js-dropdown-item').text()));
							selectedIds.push(checkbox.val());
						});
						if (all && opts.allText)
							selectedText = opts.allText;
						else
							selectedText = selected.join(', ');
						dropdown.find('.js-input').val(selectedIds.join(','));
						dropdown.find('.js-text').text(selectedText);

						return false;
					}
				});

				opts.container.find('.js-menu').data('dropdown', opts.container);

				opts.container.find('input:checked').each(function() {
					// Uncheck and emulate click
					$(this)
						.removeAttr('checked')
						.trigger('click');
				});
			}
		};


		// GLOBALIZATION
		if( !mailru.ui ) mailru.ui = {};
		mailru.ui.Options = ui;
	})();

	jsLoader.loaded('{mailru.ui}mailru.ui.Options', 1);

// data/ru/images/js/ru/ui/mailru.ui.Options.js end

// data/ru/images/js/ru/ui/mailru.ui.MailCollector.js start

/**
 * @object  mailru.ui.MailCollector
 * @author  RubaXa  <trash@rubaxa.org>
 * @author  Alexander Abashkin <a.abashkin@corp.mail.ru>
 */


(function (){
		/**
		 * Convert to array
		 * @private
		 * @param val
		 */
		function _toArray(val){
			return  typeof val == 'string' ? val.split(',') : val;
		}

		var _rb = {
			POP3: {
				ready:              704776,
				check: {
					  'def':        704867
					, 'ya.ru':      704899
					, 'yandex.ru':  704899
					, 'gmail.com':  704900
					, 'rambler.ru': 704901
					, 'other':      704902
				},
				save: {
					  'def':        704903
					, 'ya.ru':      704904
					, 'yandex.ru':  704904
					, 'gmail.com':  704905
					, 'rambler.ru': 704906
					, 'other':      704907
				},
				success: {
					  'def':        705407
					, 'ya.ru':      705419
					, 'yandex.ru':  705419
					, 'gmail.com':  705422
					, 'rambler.ru': 705424
					, 'other':      705427
				},
				error: {
					  'def':        705464
					, 'ya.ru':      705467
					, 'yandex.ru':  705467
					, 'gmail.com':  705469
					, 'rambler.ru': 705471
					, 'other':      705473
				}
			},

			IMAP: {
				// The attempt to create
				attempt: {
					 'def':         1177186
					,'yandex.ru':   1177196
					,'gmail.com':   1177197
					,'rambler.ru':  1177199
					,'hotmail.com': 1779028
				},

				// Successful completion
				success: {
					 'def':         1177200
					,'yandex.ru':   1177209
					,'gmail.com':   1177210
					,'rambler.ru':  1177213
					,'hotmail.com': 1779033
				},

				// Incorrect password
				incorrect: {
					 'def':         1177215
					,'yandex.ru':   1177217
					,'gmail.com':   1177218
					,'rambler.ru':  1177222
					,'hotmail.com': 1779046
				},

				// Over limit ( 507 )
				limit: {
					 'def':         1533583
					,'yandex.ru':   1533585
					,'gmail.com':   1533586
					,'rambler.ru':  1533589
					,'hotmail.com': 1779049
				},

				// The collector already exists
				exists: {
					// pass
				},

				// Internal error
				error: {
					 'def':         1177224
					,'yandex.ru':   1177229
					,'gmail.com':   1177231
					,'rambler.ru':  1177232
					,'hotmail.com': 1779055
				}
			}
		},

		DEFAULT_PASSWORD = '**********',

		cnRowDisabled = 'grey2',
		cnInpDisabled = 'inp_disabled',

		_emails = {},
		_remail = /\w.+@\w.+\.[a-z]{2,}/,   // check email
		_routers = [],  // [["selector", callback], ...]

		_cache = {
			id:      0,
			type:    {},
			folders: {}
		};

		ui = {
			/**
			 * Find element in context
			 *
			 * @private
			 * @param   {String}    sel
			 * @return  {jQuery}
			 */
			_$: function (sel) {
				return  $(sel, this.$View);
			},


			/**
			 * Find input by name in context
			 *
			 * @private
			 * @param   {String}    name
			 * @return  {jQuery}
			 */
			_$I: function (name){
				return this._$(ajs.map(_toArray(name), function (val) {
					return '[name="'+val+'"]'
				}).join(','));
			},


			/**
			 * Global handler for router
			 *
			 * @private
			 * @param   {Event} evt
			 */
			_onRoute: function (evt){
				//noinspection JSUnresolvedVariable
				if( !(evt.metaKey || evt.ctrlKey || evt.shiftKey) ){
					var $node = $(evt.currentTarget), i = 0, n = _routers.length, prevent;

					for( ; i < n; i += 2 ){
						if( $node.is(_routers[i]) ){
							try {
								_routers[i+1].call(this, $node, evt);
							} catch(er) {
								ajs.log('_onRoute [error]:', _routers[i], _routers[i+1], $node, evt);
							}

							//noinspection JSUnresolvedVariable
							if( !evt.noPrevent ){
								prevent = true;
							}
						}
					}

					if( prevent ){
						evt.preventDefault();
					}
				}
			},


			/**
			 * Set routers
			 *
			 * @private
			 * @param   {Object}    routers     Object("selector" => handler)
			 */
			_route: function (routers){
				ajs.each(routers, function (fn, name){
					_routers.push(name, fn);
				}, this);
			},


			/**
			 * Set smart focus
			 *
			 * @private
			 */
			_setSmartEmailFocus: function (){
				var $Email = this._$I('POPEmail'),
					val = ($Email.val().split('@')[0] || '');

				$.Autocompleter.Selection($Email[0], val.length);
			},


			/**
			 * Holds IMAP-state
			 *
			 * @private
			 */
			_IMAPData: {
				queue: null,
				state: {}
			},


			/**
			 * Detect domain
			 *
			 * @private
			 * @param {String} data
			 * @returns {Array | null}
			 */
			_getDomain: function(data) {
				return data.match(/@((?:[\w](?:[\w-]*[\w])?\.)+(?:[a-z]{2,})$)/);
			},


			/**
			 * Toggle IMAP-domain
			 *
			 * @private
			 *
			 * @param {Object} $imap_import
			 * @param {Object} $email
			 */
			_toggleDomain: function($imap_import, $email) {
				$email
					.unbind('input')
					.bind('input', function(event) {
						var domain = this._getDomain($(event.target).val());

						if (domain)
						{
							if (this._IMAPData.queue != null)
								window.clearTimeout(this._IMAPData.queue);

							this._IMAPData.queue = window.setTimeout (
								this._toggleCheckbox.bind(this, $imap_import, $email, domain[1]), 500
							);
						}
						else $imap_import.hide();
					}
					.bind(this)
				);
			},

			_isSupportedIMAP: function(provider, callback) {
				mailru.API.post('collectors/domain', {
					domain: provider
				},
				function(response) {
					callback(response.isOk() && response.getBody().imap === true, provider);
				});
			},

			/**
			 * Toggle IMAP-checkbox
			 *
			 * @private
			 *
			 * @param {Object} $imap_import
			 * @param {Object} $email
			 * @param {String} provider
			 */
			_toggleCheckbox: function($imap_import, $email, provider)
			{
				if (!$imap_import[0])
					return;

				this._isSupportedIMAP(provider, function(supported) {
					var checkbox = this._$('.js-form__checkbox__imap');

					if (supported) {
						if (!this.collectorLayerMode) {
							$imap_import.show();
						}
						else {
							$email.data('allow-submit', false);
						}

						var state = this._IMAPData.state;

						// Toggle checkbox
						checkbox
							.unbind('change')
							.bind('change', function() {
								state[provider] = !this.checked;
							})
							[state[provider] ? 'removeAttr' : 'attr']('checked', 'checked')
						;
					}
					else {
						$imap_import.hide();
						checkbox.removeAttr('checked');

						if (this.collectorLayerMode){
							$email.data('allow-submit', true);
						}
					}
				}
				.bind(this));

				this._toggleDomain($imap_import, $email);
			},


			/**
			 * Set provider
			 *
			 * @private
			 * @param {String | Element}  provider
			 */
			_setProvider: function (provider) {
				this._$('.js-notify-group').find('.js-notify-sub')
					.display(0);

				this._$('.js-collector__options')
					.display(0);

				this._$('.js-collector__form_email')
					.removeClass('inp_disabled')

				this._resetForm(function() {
					var self = this;

					if (typeof provider != 'string') {
						// noinspection JSUnresolvedFunction
						provider = ajs.toObject(provider.attr('href')).provider;
					}

					if (this.VIEW != 'FORM') {
						this._$('form').trigger('reset');
						this._$(':text,:password').val('');
					}

					if (this.isTrustProvider(provider)) {
						this._group('auth', true);
					}

					var $email = this._$I('POPEmail');
					$email.val(($email.val().split('@')[0] || '') + (provider ? '@'+ provider : ''));

					this._$(':text,:password')
						.filter(':not([name="POPEmail"])')
						.filter(':not([name="POPPassword"])')
							.val('')
					;

					this._email(null); // clear saved options
					this.setVIEW('form');
					this._setSmartEmailFocus();
					this._$('.js-provider-settings')
						.removeClass('collector__provider__item__link_settings_active');

					if(provider) {
						this._$('.js-provider-settings[href*="provider=' + provider + '"]')
							.addClass('collector__provider__item__link_settings_active');
					}

					// this._toggleCheckbox(this._$('.js-form-imap-import'), $email, provider);
				});
			},


			/**
			 * Reset form (get html)
			 *
			 * @param {Boolean|Function} fn
			 */
			_resetForm: function (fn){
				if( fn === true ){
					this._needFormReset	= true;
				}
				else if( this._needFormReset ){
					this._needFormReset = false;
					this._loadForm({}, fn);
				} else {
					fn.call(this);
				}
			},


			/**
			 * Set folder for collect messages
			 *
			 * @private
			 * @param   {jQuery|String} $node
			 */
			_setFolderTo: function ($node){
				if( !($node && $node.jquery) ){
					$node = this._$('.js-FolderTo input[name="CreatePOPFolder"][value="'+$node+'"]')
						.closest('.js-FolderTo');
				}

				this._$('.js-FolderTo')
					.find(':radio').removeAttr('checked').end()
					.find(':text').addClass(cnInpDisabled)
				;
				$(':radio', $node).attr('checked', true);
				$(':text', $node).removeClass(cnInpDisabled).focus();
			},


			/**
			 * Show notification
			 *
			 * @private
			 * @param   {String}    [group]    error group name
			 * @param   {String}    [name]
			 */
			_notify: function (group, name, top) {
				if (top) {
					// mail-9851 just show notify
					return ajs.require(['{mailru}' + 'mailru.Notify'], function (){
						mailru.Notify.add(top.type, {
							text: top.text,
							delay: 10
						});
					});
				}

				this._$('.js-notify-group').display(0);

				if (group) {
					this._$('.js-notify-' + group)
						.display(1)
							.find('.js-notify-sub')
								.display(0)
							.end()
						.find('.js-notify-' + group + '-' + name)
							.display(1)
					;
				}

				this._freez(false);
			},

			/**
			 * Show ui group
			 *
			 * @private
			 * @param   {String|Array}  name
			 * @param   {Boolean}       [focus]  set focus on first empty field
			 * @return  {jQuery}  selected group
			 */
			_group: function (name, focus) {
				this._$('.js-group').display(0);

				name = _toArray(name);

				var settings = Array.indexOf(name, 'settings');

				// Hide advanced settings for IMAP collector
				if (this._$('.js-form__checkbox__imap').is(':checked') && ~settings)
					name.splice(settings, 1);

				var groups = name.join(',.js-group-');
				var $Group = this._$('.js-group-' + groups).display(1), _focus;

				if (focus) {
					var $Elm = $Group.find(':text,:checkbox').each(function() {
						// Smart focus in group
						if( this.type == 'checkbox' && !this.checked || this.value == '') {
							if (!$(this).hasClass(cnInpDisabled)) {
								_focus = true;
								$(this).focus();
								return false;
							}
						}
					});

					if (!_focus) {
						$Elm.first().focus();
					}
				}

				return	$Group;
			},


			/**
			 * Switch for status collector
			 *
			 * @private
			 * @param   {jQuery}    $node
			 */
			_switchStatus: function ($node){
				var isNewModificator = ($node.attr('className').indexOf('form__switcher_options') !== -1 ? 'options' : '');
				var selReg = new RegExp('form__switcher_' + isNewModificator + '(\\w+)');
				var type = $node.attr('className').match(selReg) && RegExp.$1;
				if( type ){
					var
						  data = $node.closest('form').toObject()
						, on = +!!/on/.test($node.find(':radio').val())
						, lang = this._opts.lang.status
						, $row = $node.closest('.js-row')
					;
					data.action = 'status';
					data.POPDisabled = +!on;

					$row.find('.js-col').toggleClass(cnRowDisabled);

					$node.parent()
						.find('.form__switcher')
							.replaceClass(/form__switcher_\w+_selected/, '')
					;

					$node
						.addClass('form__switcher_' + isNewModificator + type + '_selected')
						.find(':radio')
							.attr('checked', true)
					;

					$('.js-txt-on', $row).text(lang[on][0]);
					$('.js-txt-off', $row).text(lang[on][1]);

					this._ajax('save', data);
				}
			},


			_getCollectorsList: function(callback) {
				mailru.API.post('collectors', function(response) {
					if (response.isOk()) {
						callback(response.getBody());
					}
					else {
						ajs.log('The list of collectors can not be loaded: ' + response);
					}
				});
			},


			_setIMAPEditData: function(id, callback) {
				this._getCollectorsList(function(response) {
					var data = null;

					Array.some(response, function(collector) {
						if (collector.id == id) {
							data = collector;
							return true;
						}
					});

					callback(data);
				});
			},

			_setFolderName: function(view, data) {
				this._$('.js-submit__result__folder_filters')[0]
					.checked = data.apply_filters;

				var folder = this._getFolderName(data.folder);

				// Set folder name
				if (data.email == folder) {
					this._$('.js-collector__submit__result__folder_name')
						.val(folder);
				}
				else {
					this._$('.js-collector__folder_user')
						.click();
				}
			},

			/**
			 * Show form for edit
			 *
			 * @private
			 * @param $node
			 */
			_edit: function (view, $node) {
				var href = $node.attr('href').split('?')[1];
				var params = ajs.toObject(href);

				var imap = params.IMAP == 1;

				if (imap) {
					_cache.id = params.ID;
				}

				this._resetForm(true);
				this._setLoading($node);

				this._loadForm(href, function () {
					var edit = this._$I('POPEmail');

					if (mailru.EnableIMAP && imap) {
						this._setIMAPEditData(_cache.id, function(data) {
							this._setFolderName(view, data);
							this.setVIEW('edit');
						}
						.bind(this));

						this.__email = this._$I('POPEmail')
							.toggleClass('inp_disabled', imap).val();
					}
					else {
						this.setVIEW('edit');
						this.__email = this._$I('POPEmail').val();
					}

					this.__pass  = this._$I('POPPassword').val();
					this._setSmartEmailFocus();
				});
			},

			/**
			 * Load edit form
			 *
			 * @param	{Object}	params
			 * @param	{Function}	fn
			 */
			_loadForm: function (params, fn){
				mailru.Ajax({
					  url:      '/settings/collector?' + ($.type(params) == 'string' ? params : $.param(params))
					, data:     'block=FORM'
					, type:     'POST'
					, dataType: 'text'
					, complete: function (R){
						if( R.isOK() ){
							this._$('.js-view-form').empty().append(R.getData());
							fn.call(this);
						}
					}.bind(this)
				});
			},

			_setLoading: function(node) {
				return node.replaceWith(this._$('.js-loading-tpl:first').clone());
			},

			/**
			 * Remove email box
			 *
			 * @private
			 * @param   {jQuery}    $node
			 * @param   {Event}     event
			 */
			_remove: function ($node, event){
				var data = ajs.toObject($node.attr('href')),
					self = this
				;

				$R('{mailru'+'.ui}mailru.ui.TipOfTheDay', function(){
					$node.TipOfTheDay({
						'maxShow': -1,
						'hideBy': 'body:mousedown',
						'orientation': 'bottom',
						'positionX': 'left',
						'html': '<div class="icon-wrap icon-wrap_balloon"><i class="icon icon_balloons icon_lamp"></i></div><div class="balloon__message"><div><b>'+Lang.get('collector.remove.title')+'</b></div><div style="margin:1px 0 3px; color:#5e6061;">'+Lang.get('collector.remove.text')+'</div><div><span class="button-a js-remove">'+Lang.get('collector.remove.btn')+'</span></div></div>',
						'onInit': function (Tip) {
							$('.js-remove', Tip.$Balloon).click(function () {
								Tip.hide();
								var $Col = $node.closest('.js-row').find('.js-col:first');
								$node.closest('.js-col-del').addClass('form__data-list__cell_vertical');

								self._setLoading($node).closest('.js-row').find('.js-col:first');

								$('<div></div>')
									.css({
										  background: '#fff'
										, opacity: .5
										, position: 'absolute'
										, width: '100%'
										, height: $Col.height()
										, marginRight: $Col.width()
									})
									.prependTo($Col)
								;

								mailru.API.post('collectors/remove',
								{
									collect : [
										{
											id:   data.id,
											type: data.type
										}
									]
								},
								function(response) {
									if (response.isOk()) {
										self._redraw();
									}
									else {
										self._notify(null, null, {
											type: 'error',
											text: Lang.get('notify.error')
										});
									}
								});
							});
						}
					});
				});

				event.stopPropagation();
			},


			/**
			 * Get/Set email settings
			 *
			 * @private
			 * @param   {String}        email
			 * @param   {Object|null}   [data]
			 * @return  {Object}
			 */
			_email: function (email, data){
				if( email === null ){
					_emails = {};
				} else {
					email = $.trim(email).toLowerCase();
					if( data === null ){
						_emails[email]  = {};
					} else if( data !== undef ){
						_emails[email] = $.extend(_emails[email], data);
					}
					return  _emails[email];
				}
			},


			/**
			 * Freez ui
			 *
			 * @private
			 * @param   {Boolean}   freez
			 * @param   {Boolean}   [txt]
			 */
			_freez: function (freez, txt){
				this._$(':input')
					.filter(':submit')
						.attr('disabled', freez)
					.end()

					.filter(':not(:submit, .js-collector__submit__result__folder_name)')
						.attr('readonly', freez)
						.toggleClass(cnInpDisabled, freez)
				;

				// Toggle loading
				this._$('.js-loading')
					.display(freez)
					.find('.js-txt')
						.text(txt ? this._opts.lang.loading[0] : '')
				;

				// Toggle disabling
				this._$('.js-collector__form__add')
					.toggleClass('form__button_disabled');

				ajs.clearSleep(this.__savePID);

				if( freez && txt ) this.__savePID = ajs.sleep(function (){
					this._$('.js-loading .js-txt').text(this._opts.lang.loading[1]);
				}.bind(this), 10*1000);
			},


			/**
			 * Update form fields
			 *
			 * @private
			 * @param   {Object} data
			 */
			_updForm: function (data){
				ajs.each(data, function (val, key){
					if( val || val === 0 ){
						var $Inp = this._$I(key);
						if( $Inp.is(':text') ){
							this._$I(key).val(val);
						} else {
							$Inp.attr('checked', val == 1);
						}
					}
				}, this);
			},

			/**
			 * Get form data
			 *
			 * @private
			 * @param	{String} sel
			 * @return	{Object}
			 */
			_getData: function (sel){
				var data = {};
				this._$(sel).find('input,select,textarea').each(function (i, inp){
					data[inp.name] = (inp.type == 'checkbox' || inp.type == 'radio') ? ~~inp.checked : $(inp).val()
				});
				return	data;
			},


			/**
			 * Input onChange
			 *
			 * @param {Event} evt
			 */
			_onInpChange: function (evt){
				evt.currentTarget.value = $.trim(evt.currentTarget.value);
			},

			/**
			 * Form.onSubmit handler
			 *
			 * @private
			 * @param   {Event} evt
			 */
			_onSubmit: function (evt) {
				evt.preventDefault();

				var
					  data  = this._getData('.js-group:visible,.js-hidden')
					, $email = this._$I('POPEmail')
					, email = $email.val()
					, pass  = this._$I('POPPassword').val()
					, allowSubmit = $email.data('allow-submit')
				;

				if( !(data.ID > 0) && (this.__email != email || this.__pass != pass) ){
					// Reset settings
					this.__email    = email;
					this.__pass     = pass;
					this._email(email, null);
					this._group('auth', true);
				}


				/** @namespace data.POPSSL */
				/** @namespace data.POPPort */
				/** @namespace data.POPEmail */
				/** @namespace data.POPPassword */

				if( this._$I('POPSSL').is(':visible') ){
					data.POPPort    = this._getPort(data.POPSSL, data.POPPort);
				} else {
					delete  data.POPSSL;
					delete  data.POPPort;
				}

				// compose settings
				data = this._email(email, data);

				if( data.ID > 0 ){
					// edit
					/*if( this.__email == email )
						delete data.POPEmail
					*/;

					if( this.__pass == pass )
						delete data.POPPassword;

					this._ajax('save', data, true);
				}
				else if( data.POPEmail && data.POPPassword ){
					// check/add
					var
						  act = data.addMethod = (data.POPVerified ? 'save' : 'check')
						, domain = data.domain = email.toLowerCase().split('@')[1]
					;

					if( act == 'check' ){
						// Create record in DB (https://jira.mail.ru/browse/MAIL-6634)
						data.SaveCollector	= 1;
					}

					if(allowSubmit){
						//  not IMAP for popup
						this._notify('conn', 'notimap');
					}
					else {
						// Send request
						this._ajax(act, data, true);
						this._cnt(_rb.POP3[act].def);
						this._cnt(_rb.POP3[act][domain] || _rb.POP3[act].other)
					}

				} else {
					// errors
					this._notify('conn', 'data');
					if( _remail.test(data.POPEmail) ){
						this._$I('POPPassword').focus();
					} else {
						this._setSmartEmailFocus();
					}
				}

				evt.preventDefault();
			},

			IMAPError: function(data) {
				return {
					is: function(error) {
						var status = false;

						if (error == 'internal' && data.status !== 400 || !$.isPlainObject(data.body))
							return true;

						Object.forEach(data.body, function(value) {
							if (value.error == error)
								return status = true;
						});

						return status;
					}
				}
			},

			_addIMAPCollector: function(data, failback) {

				// If should try only POP3!
				if (_cache.type[data.domain]) {
					return failback();
				}

				this._$('.js-collector__options')
					.display(0);

				mailru.API.post('collectors/add',
				{
					collect : [
						{
							email:    data.POPEmail,
							password: data.POPPassword,
							type:     'imap',

							// FIXME
							ssl: true,
							port: 993
						}
					]
				}, this._IMAPResponse.bind(this, data, failback));

				this._freez(true, true);
			},

			/**
			 * Send ajax-action-request
			 *
			 * @private
			 * @param   {String}    action  Enum(get,check,save,delete)
			 * @param   {Object}    data
			 * @param   {Boolean}   [freez]
			 */
			_ajax: function (action, data, freez) {
				this._notify();

				if (freez)
					this._freez(true, !(data.ID > 0));

				/** @namespace data.Folder -- folder id */
				/** @namespace data.CreatePOPFolder --radio button */
				/** @namespace data.POPReplaceToNew --- new folder name */

				if (data.CreatePOPFolder != 1) {
					delete  data.POPReplaceToNew;
				}
				else {
					delete data.Folder;
				}

				delete data.CreatePOPFolder;

				var failback = function(callback) {
					mailru.Ajax({
						  url:      this._opts.url + action
						, type:     'POST'
						, data:     data
						, complete: this._POP3response.bind(this, action, freez, callback)
					});
				}
				.bind(this);

				// if IMAP checked and group settings are hidden
				if (mailru.EnableIMAP && action == 'check' && this._$('.js-group-import').is(':hidden')) {
					this._addIMAPCollector(data, failback);
				}
				else {
					failback();
				}
			},

			_IMAPEdit: function(data, callback) {
				data.type = 'imap';

				mailru.API.post('collectors/edit', {
					collect: [data]
				},
				function(response) {
					var data = response.getBody();

					if (response.isOk()) {
						callback(response.getBody());
					}
					else {
						if (Object.isObject(data)) {
							var error = 'error';

							Object.forEach(data, function(value) {
								if (value.error == 'invalid')
									error = value.error;
							}, this);

							this._notify('edit', error);
						}
					}
				}.bind(this));
			},

			_getFolderId: function(name) {
				var folders = mailru.Folders.getAll(), id;

				Array.some(folders, function(folder) {
					if (folder.Name === name && !folder.IsSubfolder) {
						id = folder.Id;
						return true;
					}
				});

				return id;
			},

			_getFolderName: function(id) {
				var folders = mailru.Folders.getAll(), name;

				Array.some(folders, function(folder) {
					if (folder.Id === id && !folder.IsSubfolder) {
						name = folder.Name;
						return true;
					}
				});

				return name || _cache.folders[id] || this._$I('POPEmail').val();
			},

			_toggleEditFolder: function(view, special) {
				view
					// Enable input
					.find('.js-collector__submit__result__folder_name')
						.toggleClass('inp_disabled', !special)
					.end()

					// Enable styles for the custom select
					.find('.js-collector__form__select')
						.toggleClass('form_disabled form__select_disabled', special)
					.end()

					// Enable state for the custom select
					.find('.js-collector__folder_select')
						.attr('disabled', special)
					.end()

					// Fix a position for the custom select
					.find('.js-collector__form__select_position')
						.toggleClass('form__select__box_position', special)
					.end()

					// Show filters
					.find('.js-collector__submit__result__filters')
						.toggleClass('dn', special);
			},

			_IMAPSave: function(view, callback) {
				var special = true;

				var select = function() {
					$('.js-collector__folder_user')
						.trigger('click');

					_cache.folder = this.value;
				};

				view
					.delegate('.js-collector_folder_custom', 'change',
						function() {
							this._toggleEditFolder(view, special = true);
						}.bind(this)
					)

					.delegate('.js-collector__folder_user', 'click',
						function() {
							this._toggleEditFolder(view, special = false);
						}.bind(this)
					)

					.delegate('.js-collector__form__select_position', 'click', select)
					.delegate('.js-collector__folder_select', 'change', select)

					// Select folder name on focus
					.delegate('.js-collector__submit__result__folder_name', {
						focus : function() {
							if (special) {
								this.select();
							}
						},
						mouseup : function() {
							return false;
						}
					}
				);

				// Save settings
				view.delegate('.js-collector__submit__result__folder_save, .js-collector__submit__result__folder_edit', 'click', function(event) {
					var name = $.trim(view.find('.js-collector__submit__result__folder_name').val());
					var auth = {};

					this._freez(true, true);

					// Only for editing
					if (view.find('.js-group-auth').is(':visible')) {
						auth.email    = this._$('.js-collector__form_email').val();
						var password  = this._$('.js-collector__form_password').val();

						if (password != DEFAULT_PASSWORD) {
							auth.password = password;
						}
					}

					if (special) {
						if (name) {
							mailru.API.post('folders/add', {
								folders: [
									{
										name:     name,
										parent:   -1,
										only_web: false
									}
								]
							},
							function(response) {
								var folders = response.getBody(), folder;

								if (!response.isOk()) {
									if (Object.isObject(folders)) {
										Object.forEach(folders, function(value) {
											switch (value.error) {
												case 'exists':
													folder = ui._getFolderId(name);
													break;

												case 'invalid':
													ui._notify('folder', 'invalid');
													break;

												case 'required':
													ui._notify('folder', 'required');
													break;

												default:
													ui._notify('folder', 'error');
													break;
											}
										});
									}

									if (!folder) {
										return -1;
									}
								}

								folder = folder || folders[0];

								ui._IMAPEdit(
									Object.extend({
										id:      _cache.id,
										folder:  folder
									}, auth),
								callback);

								_cache.folders[folder] = name;
							});
						}
						else {
							ui._notify('folder', 'required');
						}
					}
					else {
						var filters = view.find('.js-submit__result__folder_filters')
							.is(':checked');

						ui._IMAPEdit(
							Object.extend({
								id:            _cache.id,
								folder:        _cache.folder || 0,
								apply_filters: filters
							}, auth),
						callback);
					}

					event.preventDefault();
				}
				.bind(this));
			},

			/**
			 * Processing ajax-action-request for IMAP collector
			 *
			 * @private
			 * @param {Object} data
			 * @param {Function} failback - POP3 support
			 * @param {Object} response
			 */
			_IMAPResponse: function(data, failback, response) {
				var counter = function(status) {
					var rb = _rb.IMAP[status];
					this._cnt(rb.def);
					this._cnt(rb[data.domain]);
				}
				.bind(this);

				counter('attempt');

				if (response.isOk()) {
					counter('success');

					try {
						_cache.id = response.getBody()[0].id;
					}
					catch (error) {
						ajs.log('collector.ui._IMAPResponse:', error);
					}

					this._toggleEditMode('edit');
					this._freez(false);
				}
				else {
					var error = this.IMAPError(response);

					if (response.getBody() == 'over_limit') {
						this._notify('conn', 'limit');
						counter('success');
					}
					else if (error.is('exists')) {
						this._notify('conn', 'exists');
					}
					else if (error.is('invalid')) {
						counter('incorrect');
						this._notify('conn', 'noauth');
					}
					else {
						if (error.is('unsupported')) {
						//	this._notify('conn', 'type');
							_cache.type[data.domain] = true;

							if (failback) {
								this._freez(true, true);

								failback(function() {
									this._$('.js-collector__options')
										.display(1);
								}
								.bind(this));

							}
						}
						else if (error.is('internal')) {
							counter('error');
							this._notify('conn', 'error');
						}
						else {
							this._notify('conn', 'fail');
						}
					}
				}
			},

			/**
			 * Processing ajax-action-request for POP3 collector
			 *
			 * @private
			 * @param   {String}    action
			 * @param   {Boolean}   unfreez
			 * @param   {mailru.Ajax.Result}    R
			 */
			_POP3response: function (action, unfreez, callback, R) {
				var
					  res = R.getData()
					, req = R.getOpts().data
				;

				if( unfreez ){
					this._freez(false);
				}

				if( req.addMethod ){
					var rbType = R.isOK() && res.authorizationSuccess ? 'success' : 'error';

					if( rbType == 'error' || req.addMethod == 'save' ){
						this._cnt(_rb.POP3[rbType].def);
						this._cnt(_rb.POP3[rbType][req.domain] || _rb.POP3[rbType].other);
					}
				}

				if( R.isOK() ){
					if( action == 'get' ){
						// Edit email
						this._email(res.POPEmail, res);
						this._updForm(res);
						this.setVIEW('edit', res);
					}
					else if( action == 'delete' ){
						this._redraw();
					}
					else if( action == 'check' || action == 'save' ){
						// Autocomplete empty fields
						this._updForm(res);

						/** @namespace res.authorizationSuccess */
						if( res.authorizationSuccess ){
							if( action == 'check' ){
								this._resetForm(true); // need reset form

								this._$I('POPImportLetters,POPImportContacts,POPMarkOldReaded').attr('checked', true);

								this._notify('conn', 'auth');
								this._group('import');

								// Set custom folder name
								this._$I('POPReplaceToNew').val(req.POPEmail);

								// update email settings
								this._email(req.POPEmail, res);

								// set email verified flag
								this._email(req.POPEmail, { POPVerified: 1 });

								// MoveTo "Inbox" by default
								this._setFolderTo(0);

								if( res.ID > 0 ){
									/** @namespace this._opts.lang.btn.saveSettings */
									this._$('.js-form-edit-btn').val(this._opts.lang.btn.saveSettings);
								}

								/** @namespace res.isnew */
								if(res.isnew){
									this.__isnew = 1;
								}
							}
							else {
								// Redraw list in background, after save
								this._freez(true);
								this._redraw(function (){
									this._freez(false);
									this.setVIEW('list', true, res);
								}.bind(this));
							}
						}
						else if( req.action == 'status' ){
							this._redraw();
						}
						else {
							/** @namespace res.connectionSuccess */
							this._notify('conn', res.connectionSuccess ? 'noauth' : 'fail');

							/** @namespace res.POPSimpleConfig */
	//						if( !res.connectionSuccess && !(res.POPSimpleConfig || this.isTrustProvider(res.POPEmail)) ){
	//							this._group('auth,settings', true);
	//						}

							if( !res.authorizationSuccess && res.POPSimpleConfig != 1 ){
								this._group('auth,settings', true);
							}

							if (action == 'save')
								this._$('.js-group-import').display(1);
						}
					}

					if (callback) {
						callback();
					}

				}
				else {
					alert(Lang.get('notify.error'));
				}
			},


			/**
			 * Try import letters or contacts
			 *
			 * @private
			 * @param   {jQuery}    $node
			 */
			_tryImport: function ($node){
				mailru.Ajax({
					  url:      $node.attr('href')
					, type:     'POST'
					, data:     'json=Y&dummy=Y'
					, dataType: 'json'
					, complete: this.setVIEW.bind(this, 'list')
				});
			},


			/**
			 * Collector layer mode ( change | add )
			 *
			 * @public
			 */
			collectorLayerMode: $('.js-collector__popup-status').data('mode'),


			/**
			 * Redraw view
			 *
			 * @private
			 * @param   {Function} [fn]
			 * @param   {Boolean}  [imap]
			 */
			_redraw: function (fn, imap) {
				if (this._xhr)
					this._xhr.abort();

				var data = {
					collectorPopup: this.collectorLayerMode ? 1 : 0,
					block: 'LIST',
					email: this._$I('POPEmail').val(),
					imap: +!!imap
				};

				this._xhr = mailru.Ajax({
					  url: '/settings/collector'
					, data: decodeURIComponent($.param(data))
					, dataType: 'text'
					, complete: function (R) {
						if( R.isOK() ){
							var $html = $(R.getData()), isEmpty = $html.attr('data-empty') == 'Y';
							var $viewList;

							this._$('.js-cancel-btn-parent').display(!isEmpty);

							if ( isEmpty && !imap) {
								this._setProvider(this._opts.provider);
							}

							//this._$('.js-view-list').empty().append($html);

							if( this.collectorLayerMode ){
								$viewList = this._$('.js-collector__status_box');
								this._$('.js-view-providers').hide();
							}
							else {
								$viewList = this._$('.js-view-list');
							}

							$viewList.empty().append($html);
						}

						fn && fn(R.isOK());

						this._freez(false);
					}.bind(this)
				});
			},

			_cnt: function (id){
				ajs.log('collector.ui.counter:', id);

				if (id) {
					(new Image).src = '//rs.' + mailru.SingleDomainName + '/d' + id + '.gif?' + ajs.now();
				}
			},

			/**
			 * Toggle SSL checkbox
			 *
			 * @private
			 * @param {jQuery} $node
			 * @param {Event} evt
			 */
			_onSSL: function ($node, evt){
				var
					  ssl   = $node.find('input[type="checkbox"]').is(':checked')
					, $port = this._$I('POPPort')
				;
				$port.val(this._getPort(ssl, $port.val()));
				evt.noPrevent = true;
			},

			/**
			 * Get port default port
			 *
			 * @param {Boolean} ssl
			 * @param {Number} port
			 * @return {Number}
			 */
			_getPort: function (ssl, port){
				if( !port || (ssl && port == 110 || !ssl && port == 995) ){
					port    = ssl ? 995 : 110;
				}
				return  port;
			},

			_cleanAuthData: function() {
				this._$('.js-collector__form_email, .js-collector__form_password').val('');
			},

			/**
			 * Set current view
			 *
			 * @public
			 * @param {String} name
			 * @param {Object} [data]
			 */
			setVIEW: function (name, data, res){
				var isEdit = (name = name.toUpperCase()) == 'EDIT', isAdd = name == 'FORM';
				data = data || {};

				if( this.VIEW !== name ){
					this.VIEW   = name;

					this.__email = this.__pass = null;

					this._email(null); // clear old settings
					this._notify(); // Hide visible notify

					this._$('.js-view-list').display(name == 'LIST');

					if(name === 'LIST' && this._$('.js-provider-settings').length > 0) {
						this._$('.js-provider-settings').removeClass('collector__provider__item__link_settings_active');
						this._$('.js-submit-result-message').hide();

						if (res && this.__isnew) {
							//noinspection JSUnresolvedVariable
							var isImportContacts = res.POPImportContacts == 1,
								isImportLetters = res.POPImportLetters == 1,
								isMarkOldReaded = res.POPMarkOldReaded == 1;

							delete this.__isnew;

							if (isImportContacts || isImportLetters || isMarkOldReaded) {
								this._$('.js-result-string').hide();

								if(isImportContacts && isImportLetters){
									this._$('.js-result-string-1').show();
								}
								else{
									if(isImportLetters){
										this._$('.js-result-string-2').show();
									}
									if(isImportContacts){
										this._$('.js-result-string-3').show();
									}
								}

								if(isMarkOldReaded){
									this._$('.js-result-string-4').show();
								}

								var type = this._$('input[name=CreatePOPFolder]:checked').val();
								var $Folder = this._$I(type == 1 ? 'POPReplaceToNew' : 'Folder');
								var text = $Folder.is('select') ? $Folder.children().eq($Folder.attr('selectedIndex')).text() : $Folder.val();

								if(text) {
									this._$('.js-folder-name').text(text);
									this._$('.js-result-string-5').show();
								}
								this._$('.js-submit-result-message').show();
							}
						}
						else if (res) {
							this._notify(null, null, {
								type: 'ok',
								text: Lang.get('notify.save')
							});
						}
					}

					this._$('.js-view-form')
						.display(isAdd || isEdit)
						.find('.js-form-title')
							.display(0)
							.filter('.js-form-title-'+(isEdit ? 'edit' : 'add'))
								.display(1)
								.find('.js-email')
									.text(data.POPEmail || '')
					;

					if ( isAdd ){
						this._$I('ID').remove();
						this._group('auth');
						this._setSmartEmailFocus();
					}
					else if( isEdit ){
						this._$('.js-form-edit-btn')
							.display(0)
							.filter(isAdd ? '.js-add' : '.js-save')
								.display(1)
						;

						this._group('auth,import'+(this.isTrustProvider(this._$I('POPEmail').val()) || 1 == this._$I('POPSimpleConfig').val() ? '' : ',settings'), true);
					}
					else if (data !== true) {
						this._redraw();
					}
				}
			},


			/**
			 * Check meil or provider
			 *
			 * @public
			 * @param   {String}    provider
			 * @return  {Boolean}
			 */
			isTrustProvider: function (provider){
				if( _remail.test(provider) )
					provider = provider.split('@')[1];

				return !!~ajs.indexOf(this._opts.trustProviders, (provider+'').toLowerCase());
			},

			_toggleEditMode: function(mode, response) {
				this._resetForm(true);

				switch (mode) {
					case 'edit':
						this._redraw(function() {
							this._$('.js-view-list, .settings__collector__submit-result__save-folder, ' +
								'.settings__collector__submit-result-message, .js-view-form').show();

							this._$('.js-view-form, .js-collector__button-add, .js-collector__list').hide();
							this._cleanAuthData();
						}.bind(this), true);

						break;

					default:
						this._$('.js-view-form, ' +
							'.settings__collector__submit-result__save-folder').hide();

						this._$('.js-view-list, ' +
							'.js-collector__button-add, .js-collector__list').show();

						this.setVIEW('list');

						this._notify(null, null, {
							type: 'ok',
							text: Lang.get('notify.save')
						});
				}
			},

			_toggleValue: function(view) {
				$(view)
					.delegate('#POPPassword', 'focus blur', function() {
						this.value = function(value, optional) {
							return value == optional ? '' : value || optional;
						}(this.value, this.defaultValue);
					})

					.delegate('label[for="POPPassword"]', 'mousedown', function(event) {
						event.preventDefault();
					});
			},

			/**
			 * Wrap ui view
			 *
			 * @public
			 * @param   {jQuery} view
			 * @param   {Object} [opts]
			 */
			wrap: function (view, opts){
				mailru.Folders.set(arMailRuFolders, 0, 1);

				ajs.log('mailru.ui.MailCollector.wrap:', view);

				this._cnt(_rb.POP3.ready);

				this._opts  = opts = ajs.extend({
					  url: '/settings/collector?ajax_call=1&func_name='
					, provider: 'yandex.ru'
					, trustProviders: ['yandex.ru', 'rambler.ru', 'gmail.com', 'qip.ru', 'hotmail.com', 'yahoo.com']
				}, opts);


				this.$View	= $(view)
					.delegate('a,label,input', 'click',
						this._onRoute.bind(this))

					.delegate('input', 'change blur',
						this._onInpChange.bind(this))

					.delegate('form.js-form', 'submit',
						this._onSubmit.bind(this))
				;

				this._IMAPSave(this.$View, this._toggleEditMode.bind(this, 'hide'));

				// MAIL-14929
				this._toggleValue(view);

				// Routing
				this._route({
					  '.js-provider':	this._setProvider
					, '.js-add-email':  this._setProvider.bind(this, opts.provider)
					, '.js-FolderTo':	this._setFolderTo.gap(this)
					, '.js-switcher':	this._switchStatus.gap(this)
					, '.js-edit-box':   this._edit.gap(this).bind(this, this.$View)
					, '.js-remove':		this._remove
					, '.js-cancel-btn': this.setVIEW.bind(this, 'list')
					, '.js-try-import': this._tryImport
					, '.js-ssl':        this._onSSL
				});

				// Set default provider
				if (!this._$('.js-view-list').is(':visible')) {
					var $GET	= ajs.toObject(jsHistory.get());
					this._setProvider('provider' in $GET ? $GET.provider : opts.provider);

					ajs.each($GET, function (val, inp) {
						inp = this._$I(inp);

						if (inp.type == 'checkbox') {
							inp.checked = val == 1;
						}
						else {
							$(inp).val(val);
						}
					}, this);
				}
			}
		};

		// GLOBALIZATION
		if (!mailru.ui)
			mailru.ui = {};

		mailru.ui.MailCollector = ui;

		jsLoader.loaded('{mailru.ui}mailru.ui.MailCollector', 1);
	})();

// data/ru/images/js/ru/ui/mailru.ui.MailCollector.js end

// data/ru/images/js/ru/ui/mailru.ui.SettingsFilters.js start


mailru.ui.SettingsFilters = {

		wrap: function (el, options){
			this.$el = el = $(el);

			var needConfirmEmail = false;
			if(options.ConfirmCode && options.ConfirmEmail && options.ConfirmForwardId) {
				needConfirmEmail = true; //MAIl-10367
			}

			$('.form__switcher__wrapper', el).form__switcher();

			var form = $('#options-form-filters', el);

			// mail-9851 notifications
			ajs.require(['{mailru}'+'mailru.core', '{mailru}'+'mailru.Notify'], function (){
				var result = GET.result;
				if ( result == 'add' ) {
					mailru.Notify.add('ok', { text: Lang.get('notify.filter.add'), delay: 10 });
				}
				else if ( result == 'edit' ) {
					mailru.Notify.add('ok', { text: Lang.get('notify.filter.edit'), delay: 10 });
				}
				else if ( result == 'forward_failed' ) { // mail-10367
					mailru.Notify.add('error', { text: Lang.get('notify.filter.forward_failed'), delay: 10 });
				}
				else if ( result == 'forward_confirmed' ) {
					mailru.Notify.add('ok', { text: Lang.get('notify.filter.forward_confirmed'), delay: 10 });
				}
			});

			// dropdown-button
			var dropdownButton = $('.js-dropdownButton', form);
			dropdownButton
				.dropdown({
					link: '.js-dropdown',
					container: '.js-dropdown-list',
					onClick: function(e){
						Dropdown.hide(this.group);
						var item = $(e.target),
							href = item.attr('data-value');

						location.href = href;
						return false;
					}
				});

			form.delegate('.js-switcher', 'click', function(e) {
				var row = getRow(e),
					radio = $(e.target),
					on = radio.val() === 'on' && radio.is(':checked');

				$R('{mailru}' + 'mailru.Ajax', function() {
					mailru.Ajax({
						type: 'POST',
						url: 'ajax_settings?ajax_call=1&func_name=switch_filter',
						data: {
							id: row.attr('data-id'),
							on: on ? 1 : 0
						},
						isUser: true,
						complete: function(Result){}
					});
				});
			});

			form.delegate('.js-remove', 'click', function(e) {
				var row = getRow(e);
				LayerManager.show('settings__filters__delete', {
					filterId: row.attr('data-id'),
					filterText: row.find('.js-filter-text').html(),
					isFwd: row.find('.js-remove').attr('data-fwd'),
					success: function() {
						row.fadeOut(
							'slow'
							, function() {//MAIL-9849
								var row = this
									, rows = $(row).closest(".form__data-list").find(".form__data-list__row[draggable1=true]")
								;

								if(rows.length == 2) {
									rows.attr("draggable1", "false");
									rows.find(".form__data-list__cell-draggable_notification").remove();
									rows.css("border-bottom", "1px solid #CCC");
								}

								row.remove();
							}.bind(row)
						);

						ajs.require(['{mailru}mailru.Notify'], function (){
							mailru.Notify.add('ok', { text: Lang.get('notify.filter.delete'), delay: 10 }); // mail-9851
						});
					}
				});
				return false;
			});

			form.delegate('.js-confirm-email', 'click', function(e) {
				var link = $(e.target),
					row = getRow(e);
				LayerManager.show('settings__filters__confirmEmail', {
					email: link.attr('data-email'),
					emailId: link.attr('data-emailId'),
					useCaptcha: !!options.UseCaptchaOnEmailConfirmation,
					success: function() {
						link.parent().find('.js-email-ok_' + link.data('emailId')).show();
						link.remove();

						// No more not confirmed emails in this filter
						if (!row.find('.js-confirm-email').length) {
							row.removeClass('form__data-list__cell_error');
							/*row.find('.js-force-filter')
								.not('[data-disable="1"]')
								.show();*/ // mail-12048
						}

						ajs.require(['{mailru}mailru.Notify'], function (){
							mailru.Notify.add('ok', { text: Lang.get('notify.filter.forward_confirmed'), delay: 10 }); // mail-9851
						});
					}
				});
				return false;
			});

			if(needConfirmEmail)
			{
				LayerManager.show('settings__filters__confirmEmail', {
					code: options.ConfirmCode,
					email: options.ConfirmEmail,
					emailId: options.ConfirmForwardId,
					useCaptcha: !!options.UseCaptchaOnEmailConfirmation,
					success: function() {
						var link = form.find('.js-confirm-email[data-emailId="'+options.ConfirmForwardId+'"]'),
							row = link.closest('.js-rule-container');

						link.parent().find('.js-email-ok_' + link.data('emailId')).show();
						link.remove();

						// No more not confirmed emails in this filter
						Array.forEach(row, function(r, i) {
							var $r = $(r);
							if (!$r.find('.js-confirm-email').length) {
								$r.removeClass('form__data-list__cell_error');
								/*$r.find('.js-force-filter')
									.not('[data-disable="1"]')
									.show();*/ // mail-12048
							}
						});

						ajs.require(['{mailru}mailru.Notify'], function (){
							mailru.Notify.add('ok', { text: Lang.get('notify.filter.forward_confirmed'), delay: 10 }); // mail-9851
						});
					}
				});
			}

			form.delegate('.js-force-filter', 'click', function(e) {
				var row = getRow(e);
				LayerManager.show('settings__filters__forceFilter', {
					filterId: row.attr('data-id'),
					filterText: getFilterText(row),
					foldersList: $('#foldersList').html(),
					success: function() {
						// Fake indicator
						row.find('.js-force-filter').hide();
						row.find('.js-interactive').removeClass('form__data-list__cell_interactive');
						var indicator = row.find('.js-processing');
						indicator.show();
						setTimeout(function() {
							indicator.hide();
						}, 1000*60);
					}
				});

				return false;
			});

			function getFilterText(row) {
				var filterText = $(row.find('.js-filter-text').html());
				// mail-9431 do not copy dnd indicator dots
				filterText = filterText
					.filter(function(i, node){return !node.className || (" " + node.className + " ").indexOf(" js-do-not-clone ") === -1});
				filterText.find(".js-do-not-clone").remove();
				// mail-8535 before passing filter text to layer, hide long conditions
				filterText.find('.js-expandable-text-wrapper').each(function() {
					var wrapper = $(this)
						,content = wrapper.find('.js-expandable-text');

					if( content.attr('data-expand-max-height') ) {
						content.css( { 'overflow':'hidden', 'max-height':parseInt(content.attr('data-expand-max-height')) } );
					}
					wrapper.find('.js-expand-text').remove();
				});

				return filterText;
			}

			$('.js-expandable-text-wrapper').each(function() {
				var wrapper = $(this)
					,content = wrapper.find('.js-expandable-text')
					,divHeight = wrapper.height()
					,fontSize = wrapper.css('font-size')
					,lineHeight = Math.floor(parseInt(fontSize.replace('px','')) * 1.5);

				if(divHeight > (lineHeight * 2) ) {
					// hide other lines and add control to expand div to show those lines
					content.css( { 'overflow':'hidden', 'text-overflow':'ellipsis', 'max-height':(lineHeight * 2 - 1) } );
						//.attr('data-expand-max-height', (lineHeight * 2 - 1));

					/*wrapper.css( { 'max-height':(lineHeight * 4) } )
						.append( function(){
							return $('<a>'+Lang.get("expandable_text.expand")+'</a>')
								.addClass('pseudo-link js-expand-text')
								.click(function(){
									// reset height
									wrapper.css( {'max-height':''} )
										.find('.js-expand-text').remove();
									content.css( {'max-height':'', 'overflow':''} );
								});
						});*/
				}
			});

			$('.js-expandable-conditions').each(function() { // MAIL-9442
				var wrapper = $(this)
					,items = wrapper.find('.js-condition-item')
					,numVisibleItems = 4;

				if(items.length > numVisibleItems) {
					// hide conditions
					items.filter(':gt('+(numVisibleItems-1)+')')
						.hide();
					// insert 'expand'
					var expand = $('<div></div>')
									.html(Lang.get('expandable_text.expand_condition'))
									.addClass('js-expand-condition, pseudo-link');
					items.filter(':eq('+(numVisibleItems-1)+')')
						.after(expand);

					expand.click(function() {
						expand.remove();
						// show all conditions
						for (var i = numVisibleItems; i < items.length; i++) {
							items.filter(':gt('+(numVisibleItems-1)+')')
								.show();
						}
					});
				}
			});


			function getRow(e) {
				return $(e.currentTarget).closest('.js-rule-container');
			}

			// dnd
			var _currentDragTarget_
			  /*, IS_WEBKIT = /webkit/i.test(navigator.userAgent)
			  , IS_WINSAFARY = !!~(window.navigator.platform + "").indexOf("Win") && /safari/i.test(navigator.userAgent)*/
			//, _drag_direction
				, _global_currentCopyOfDraggableElement
				, _global_currentCopyOfDraggableElement_TESTED_ID = "UUID_" + Math.random()
				, trMask =
					$("<div style='position:absolute;top:0;left:0;right:0;bottom:0;background:white'></div>")
						.css("opacity", .9)
						.each(function(i, node) {
							var boxShadowValue = "1px 1px 3px #CFCFCF inset,-1px -1px 3px #CFCFCF inset";
							if("boxShadow" in node.style) {
								node.style.boxShadow = boxShadowValue;
							}
							else if("webkitBoxShadow" in node.style) {//Safari до версии 5.1, Chrome до версии 10.0 и iOS
								node.style["webkitBoxShadow"] = boxShadowValue;
							}
							else if("mozBoxShadow" in node.style) {//Firefox до версии 4.0 поддерживает свойство -moz-box-shadow.
								node.style["mozBoxShadow"] = boxShadowValue;
							}
							else {//IE
								node.style.border = "2px solid #D8D8D8";
							}
						})
				, dropTarget_Elements = {
					all : [],
					last : null
				}
				, cssTransitionProperty =
					"transition" in document.body.style ? "transition" :
						($.support.cssPrefix + "Transition") in document.body.style ?
							$.support.cssPrefix + "Transition" :
							""
				, CSS_Z_INDEX_FOR_ABSOLUTED_ELEMENTS = 9999999
			//, __dataTransfer//no need for now
				, __drag_and_drop_stage__
				, __dragStart_originalTarget_
				, throttle_set_and_check_Position_global_currentCopyOfDraggableElement
				, throttle_documentMouseMoveForScrolling
				, _tmp_
				, jBodyAndHTML = $("body,html")
				, jDocument = $(document)
				, draggable_and_dropzone_items
				, draggable_and_dropzone_items_coords = []
				, IS_POINER_EVENTS_SUPPORT = (function() {
					//https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css-pointerevents.js
					var element = document.createElement('x')
						, documentElement = document.documentElement
						, getComputedStyle = window.getComputedStyle
						, supports
						;

					if(!getComputedStyle || !('pointerEvents' in element.style)){
						return false;
					}

					element.style.pointerEvents = 'auto';
					element.style.pointerEvents = 'x';
					documentElement.appendChild(element);
					supports = getComputedStyle &&
						getComputedStyle(element, '').pointerEvents === 'auto';
					documentElement.removeChild(element);

					return !!supports;
				})()
			;

			//style's
			_tmp_ = form.find(".form__data-list");

			form
				.find(".form__data-list__row:last-child")
				.css("border-bottom", _tmp_.css("border-bottom"))
			;
			_tmp_
				.css("border-bottom", "none")
			;
			//Фиксим, чтобы правые бордюры у строк (<tr>) не обрезались на один пиксель из-за $(.page)->overflow==hidden
			_tmp_ = _tmp_
				.closest(".page")
			;
			_tmp_
				.css("padding-right", parseInt(_tmp_.css("padding-right")) || 0 + 1)
			;
			_tmp_ = void 0;

			// Compare Position - MIT Licensed, John Resig
			function _comparePosition(a,b){return a.compareDocumentPosition?a.compareDocumentPosition(b):a.contains?(a!=b&&a.contains(b)&&16)+(a!=b&&b.contains(a)&&8)+(0<=a.sourceIndex&&0<=b.sourceIndex?(a.sourceIndex<b.sourceIndex&&4)+(a.sourceIndex>b.sourceIndex&&2):1)+0:0}


			function delayFunction(_function, delayedTime, thisObj) {
				var timeoutId;

				delayedTime = delayedTime || 500;

				return function() {
					//if(arguments[0] === false)debugger
					//console.log("===", _function.name, "===", arguments[0], arguments[1])
					if(thisObj === void 0)thisObj = this;

					clearTimeout(timeoutId);

					timeoutId = setTimeout(_function.bind(thisObj, arguments[0], arguments[1]), delayedTime);
				}
			}
			function DropTargetZone(jq_element) {
				this.defaultHeight = jq_element.height();
				this.masterjElement = jq_element.closest("tr");

				//Can't use jQuery clone(true) die f*ckin Safari and stupid (A=$("<input checked name=test type=radio>")).clone();A[0].checked==false bug
				var el = this.jElement = jq_element.clone(true)//$(jq_element[0].cloneNode())
					/*, events = jq_element.data("events")
					, type
					, typeEvents
					, handler*/
				;

				/*for ( type in events ) if(Object.prototype.hasOwnProperty.call(events, type)) {
					typeEvents = events[ type ];
					for ( handler in typeEvents ) if(Object.prototype.hasOwnProperty.call(typeEvents, handler)) {
						jQuery.event.add( el, type, events[ type ][ handler ], events[ type ][ handler ].data );
					}
				}*/

				el
					.addClass("form__data-list__row_hover")
					.removeClass("form__data-list__row_nohover form__data-list__cell_error")
					.attr({"draggable1": "false", "dropzone1": "true"})
					.empty()
					.append(
						"<td colspan='" +
							jq_element.find("td").length +
							"'></td>"
					)
					.css({
						"height": 0,
						"border" : "1px #CCC dashed",
						"display": "none",
						"border-right-width" : "1px"
					})
					.css(cssTransitionProperty, "height .4s")
				;

				this.hide = delayFunction(this.hide, 150)
			}
			DropTargetZone.prototype.position = function(isBefore) {
				var dir = this.masterjElementDirection = isBefore ? "before" : "after";
				this.masterjElement[dir](this.jElement);
			};
			DropTargetZone.prototype.show = function __debug_show(isShow, forsed) {
				if(isShow === void 0)isShow = true;

				this.hide(!isShow, forsed);
			};
			DropTargetZone.prototype.hide = function(isHide, forsed) {
				if(isHide === void 0)isHide = true;

				//if(isHide === false)debugger

				this.isShow = !isHide;

				var all = this.jElement
					, defaultHeight = this.defaultHeight
					, thisObj = this
					;

				if(!forsed && cssTransitionProperty && isHide) {
					this.displayNodeTimeout = setTimeout(function() {
						all.css("display", "none");
					}, 400);
				}
				else all.css("display", isHide ? "none" : "");

				//console.log("isHide = ", isHide, " | forsed = ", forsed)

				if(!isHide && thisObj.displayNodeTimeout) {
					clearTimeout(thisObj.displayNodeTimeout);
					thisObj.displayNodeTimeout = null;
				}

				this.nextHeightValue = isHide ? 0 : defaultHeight;

				if(forsed) {
					all.css("height", thisObj.nextHeightValue);
				}
				else if(!thisObj.heightTimeout) {
					thisObj.heightTimeout = setTimeout(function() {
						all.css("height", thisObj.nextHeightValue);
						thisObj.heightTimeout = null;
					}, 20);
				}

				this.masterjElement.css("border-" + (this.masterjElementDirection == "after" ? "bottom" : "top"), isHide ? "" : "none");
				if(this.masterjElementDirection == "after") {
					this.jElement.next("[dropzone1!=true]").css("border-top", isHide ? "" : "none");
				}
				else {
					this.jElement.prev("[dropzone1!=true]").css("border-bottom", isHide ? "" : "none");
				}
			};
			DropTargetZone.prototype.forcedHide = function(isHide) {
				DropTargetZone.prototype.hide.call(this, isHide, true)
			};

			function destroy_global_currentCopyOfDraggableElement(forsed) {
				if(_global_currentCopyOfDraggableElement) {
					Array.forEach(dropTarget_Elements.all, function(dropTargetZone, index) {
						dropTargetZone.hide();
						dropTargetZone.forcedHide();
					});

					var pos = _global_currentCopyOfDraggableElement.__draggedElement__.offset();

					cssTransitionProperty ?
						setTimeout(function() {
							//In FF11-12 on Unix, _global_currentCopyOfDraggableElement.remove.bind(_global_currentCopyOfDraggableElement) works incorrect FFFFFUUUUUU
							this.remove()
						}.bind(_global_currentCopyOfDraggableElement), 200)
						:
						_global_currentCopyOfDraggableElement.remove()
					;

					_global_currentCopyOfDraggableElement.attr("id", "");
					_global_currentCopyOfDraggableElement.css({top: pos.top, left: pos.left});
				}

				//На всякий случай проверяем ещё раз
				if(_global_currentCopyOfDraggableElement = document.getElementById(_global_currentCopyOfDraggableElement_TESTED_ID)) {
					try {
						destroy_global_currentCopyOfDraggableElement(forsed);
					}
					catch(e){}
					_global_currentCopyOfDraggableElement = null;
				}
			}

			function dragend_event_eventHandler(evt) {
				var draggedElement = $(evt.target);

				//console.log(evt.type, trMask+"")

				function kill() {
					this.css({
						position : ""
					});
					trMask.remove();
				}
				cssTransitionProperty ?
					setTimeout(kill.bind(draggedElement), 200)
					:
					kill.call(draggedElement)
				;

				_currentDragTarget_ = null;

				//form.find('.form__data-list__row').attr("draggable1", true);
			}

			draggable_and_dropzone_items = form.find('.form__data-list__row');

			//MAIL-9849 BEGIN -------------------------
			if(draggable_and_dropzone_items.length === 1) {
				draggable_and_dropzone_items.find(".form__data-list__cell-draggable_notification").remove();
			}
			//MAIL-9849 END -------------------------

			draggable_and_dropzone_items
				.attr("draggable1", true)
				.bind('dragstart1', function(evt) {
					var draggedElement = $(evt.target)
						, filterId = draggedElement.attr("data-id")
						, position
						//MAIL-9849 BEGIN -------------------------
						, brother
					;

					brother = evt.target;
					while(brother = brother.nextSibling) if(brother.nodeType == 1 && brother.getAttribute("draggable1") != "false") break;
					if(!brother) {
						brother = evt.target;
						while(brother = brother.previousSibling) if(brother.nodeType == 1 && brother.getAttribute("draggable1") != "false") break;
					}

					if(!brother) {
						evt.preventDefault();
						return false;
					}
					//MAIL-9849 END -------------------------

					//console.log(evt.type, draggedElement.attr("data-id"))

					if(!filterId || (draggedElement.attr("draggable1") + "") != "true")return;
					_currentDragTarget_ = evt.target;

					position = draggedElement.offset();
					(_global_currentCopyOfDraggableElement = $("<table>").append(draggedElement.clone()))
						.attr("id", _global_currentCopyOfDraggableElement_TESTED_ID)
						.css({
							position: "absolute",
							zIndex: CSS_Z_INDEX_FOR_ABSOLUTED_ELEMENTS,
							width: draggedElement.width(),
							height: draggedElement.height(),
							backgroundColor: "white",
							top: position.top,
							left: position.left + 20,
							borderCollapse: "collapse",
							border: "1px solid #ccc",
							pointerEvents: "none"
						})
						.css(cssTransitionProperty, "top .2s,left .2s")
						.find("*")
						.each(function(i, node) {
							if(node.id)node.id = "";
							if(node.name)node.name = "";
						})
					;

					_global_currentCopyOfDraggableElement.appendTo($("body"));

					_global_currentCopyOfDraggableElement.__draggedElement__ = draggedElement;

					/*draggedElement.css({
					 position: "static"
					 });*/
					trMask.css({
						top: 0,
						bottom: 0,
						width: draggedElement.width(),
						zIndex: CSS_Z_INDEX_FOR_ABSOLUTED_ELEMENTS - 1
					});
					draggedElement.find(".form__data-list__cell_filters__inner").first().append(trMask);
				})
				.bind('dragend1', dragend_event_eventHandler)
				.bind('dragenter1', function(evt) {
					var _target = $(evt.target).closest(".form__data-list__row")
						, filterId = _target.attr("data-id")
						, dropZoneObject
						;

					//console.log(evt.type, _target.attr("data-id"))

					if(!_target.length)return;

					if(_target[0] !== _currentDragTarget_) {
						if(!(dropZoneObject = dropTarget_Elements[filterId])) {
							dropZoneObject = dropTarget_Elements[filterId] = new DropTargetZone(_target);
							dropTarget_Elements.all.push(dropZoneObject)
						}
						dropZoneObject.position(
							//!$(_currentDragTarget_).nextAll("[data-id=" + filterId + "]").length
							_comparePosition(_currentDragTarget_, _target[0]) == 2
						);
						dropZoneObject.defaultHeight = _global_currentCopyOfDraggableElement.height();
						//console.log("   ", evt.type, _target.attr("data-id"))
						dropZoneObject.show();
					}
				})
				.bind('dragleave1', function(evt) {
					var _target = $(evt.target).closest(".form__data-list__row")
						, filterId = _target.attr("data-id")
						;
					//console.log(evt.type, filterId)

					if(dropTarget_Elements[filterId]) {
						dropTarget_Elements[filterId].hide();
					}
				})
				.bind('dragover1 drop1', function(evt) {
					var _target = $(evt.target).closest(".form__data-list__row");

					//Scroll page
					throttle_documentMouseMoveForScrolling(evt);

					if(_target &&
						_target.attr("draggable1") &&
						_currentDragTarget_ &&
						_currentDragTarget_ !== this) {

						//console.log(evt.type, " --------- ")

						evt.preventDefault();
						evt.stopPropagation();

						if(evt.type == "drop1") {
							var rowsParent = _target.parent();

							_target[_comparePosition(_currentDragTarget_, _target[0]) == 2 ? "before" : "after"](_currentDragTarget_);

							var filterIds = rowsParent.find(".form__data-list__row")
								.filter(function(index, node) {
									return !node.getAttribute("dropzone1");
								})
								.map(function(index, node) {
									return node.getAttribute("data-id");
								})
								.toArray();

							//console.log(filterIds);

							$R('{mailru}' + 'mailru.Ajax', function() {
								mailru.Ajax({
									url: 'ajax_filters_order?func_name=move'
									, type: 'POST'
									, data: { filter_ids: filterIds.join(',') }
									, complete:function (Result){
										if( !Result.isOK() ){
											mailru.Notify.add('error', { text: Lang.str('options.filters.error.move'), delay: 10 });
										}
									}
								})
							});

							destroy_global_currentCopyOfDraggableElement(true);
							dragend_event_eventHandler(evt);
						}
					}
					else if(evt.type == "drop1") {
						destroy_global_currentCopyOfDraggableElement(true);
						dragend_event_eventHandler(evt);
					}

					return !evt.isDefaultPrevented();
				})
			;

			/**
			 * @param {Object(pageY: number, pageX: number)}
			 */
			function set_and_check_Position_global_currentCopyOfDraggableElement(evt) {
				if(_global_currentCopyOfDraggableElement) {

					//move copy of draggable element
					var /*x = evt["pageX"] || evt["originalEvent"] && evt["originalEvent"]["pageX"] || set_and_check_Position_global_currentCopyOfDraggableElement.prevX
					 , */y = evt["pageY"] || evt["originalEvent"] && evt["originalEvent"]["pageY"] || set_and_check_Position_global_currentCopyOfDraggableElement.prevY
						, eventReplacerType
						;

					//set_and_check_Position_global_currentCopyOfDraggableElement.prevX = x;
					set_and_check_Position_global_currentCopyOfDraggableElement.prevY = y;

					_global_currentCopyOfDraggableElement.css({
						//left: x,
						top: y + (IS_POINER_EVENTS_SUPPORT ? 0 : 20)
					});
				}
			}
			set_and_check_Position_global_currentCopyOfDraggableElement.prevX = 0;
			set_and_check_Position_global_currentCopyOfDraggableElement.prevY = 0;

			throttle_set_and_check_Position_global_currentCopyOfDraggableElement = set_and_check_Position_global_currentCopyOfDraggableElement.throttle(80);

			throttle_documentMouseMoveForScrolling = function(e) {
				var y = e.pageY
					, scrollTop = jDocument.scrollTop()
					, delta = -50
					, scrollTo
					, window_height
				;

				if(y - scrollTop < -delta) {
					scrollTo = Math.max(scrollTop + delta, 0);
				}
				else if(y - (scrollTop + (window_height = $(window).height())) > delta) {
					scrollTo = Math.min(scrollTop - delta, (jBodyAndHTML.scrollHeight() - window_height));
				}

				if(scrollTo !== void 0) {
					jBodyAndHTML.stop().animate({
						scrollTop: scrollTo
					}, 200, 'linear');
				}
			}.throttle(200);

			$(form).find("*").unselectable(true);

			function onDraggedEvent(evt) {
				var event_type = evt.type
					, target = evt.currentTarget
					, new__drag_and_drop_stage__
				;

				//Filter for non-left-mouse-button
				if(evt.which > 1 ||
					(event_type !== "mousedown" && !__drag_and_drop_stage__)) {
					return;
				}

				if(event_type == "mousedown") {
					__drag_and_drop_stage__ = 1;
					evt.preventDefault();
					/*__dataTransfer = {
					 setData: function(type, data) {
					 this["_" + type] = data;
					 },
					 getData: function(type, data) {
					 return this["_" + type];
					 }
					 };*/
					jDocument.bind('mousemove', throttle_set_and_check_Position_global_currentCopyOfDraggableElement);
					jDocument.bind('mousemove', throttle_documentMouseMoveForScrolling);

					return;
				}

				if(event_type == "mousemove" && __drag_and_drop_stage__ != 2) {
					return
				}

				if(!__drag_and_drop_stage__)return;

				var dndEventType;
				if(__drag_and_drop_stage__ == 1) {
					if(event_type == "mousemove" || event_type == "mouseover" || event_type == "mouseenter") {
						new__drag_and_drop_stage__ = 2;
						dndEventType = "dragstart1";
					}
				}
				else if(__drag_and_drop_stage__ > 1) {
					dndEventType =
						event_type == "mouseenter" || event_type == "mouseover" ?
							__drag_and_drop_stage__ == 3 ? (
								new__drag_and_drop_stage__ = 4,
									"dragenter1"
								) :
								"dragover1"//__mouseDown == 3
							:
							event_type == "mouseleave" ?
								__drag_and_drop_stage__ > 2 && (
									new__drag_and_drop_stage__ = 3,
										"dragleave1"
									)
								:
								event_type == "mousemove" || event_type == "mouseover" || event_type == "mouseenter" ? "dragover1" :
									event_type == "mouseup" && __drag_and_drop_stage__ == 4 ? "drop1" : "dragend1" || ""
					;
					if(__drag_and_drop_stage__ == 2)new__drag_and_drop_stage__ = 3;
				}

				if(dndEventType) {
					evt.preventDefault();

					if(target === document) {//Это баг определялки dnd событий. Пока такой кастыль
						dndEventType = "dragend1";
					}

					if(dndEventType == "dragend1") {
						new__drag_and_drop_stage__ = 0;
						target = __dragStart_originalTarget_;
						__dragStart_originalTarget_ = void 0;
					}

					var customJQEvent = $.Event({
						type: dndEventType,
						target: target
						//dataTransfer: __dataTransfer,
					});

					customJQEvent.pageX = evt.pageX;
					customJQEvent.pageY = evt.pageY;
					$(target).trigger(customJQEvent);
					if(dndEventType == "dragstart1" && customJQEvent.isDefaultPrevented()) {
						//default prevented dragstart
						return;
					}

					if(dndEventType == "dragover1") {
						if(customJQEvent.isDefaultPrevented())new__drag_and_drop_stage__ = 4;
					}
					else if(dndEventType == "drop1") {
						new__drag_and_drop_stage__ = 0;
						__dragStart_originalTarget_ = void 0;
					}
					else if(dndEventType == "dragstart1") {
						__dragStart_originalTarget_ = $(evt.target).closest("[draggable1=true]");
					}

					if(new__drag_and_drop_stage__ !== void 0)__drag_and_drop_stage__ = new__drag_and_drop_stage__;
					//evt.preventDefault();
					//return false;
				}

				if(event_type == "mouseup") {
					evt.preventDefault();

					__drag_and_drop_stage__ = 0;
					jDocument.unbind('mousemove', throttle_set_and_check_Position_global_currentCopyOfDraggableElement);
					jDocument.unbind('mousemove', throttle_documentMouseMoveForScrolling);
					destroy_global_currentCopyOfDraggableElement();
				}
			}

			form
				.delegate('.form__data-list__row', 'mouseenter mouseleave mouseover mousemove mousedown mouseup', onDraggedEvent)
			;

			jDocument.mouseup(onDraggedEvent);
		}
	};

	jsLoader.loaded('{mailru.ui}mailru.ui.SettingsFilters', 1);

// data/ru/images/js/ru/ui/mailru.ui.SettingsFilters.js end

// data/ru/images/js/ru/ui/mailru.ui.SettingsFiltersEdit.js start

/*global CheckForm*/


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
				  width: "auto"//not a css 'auto'!
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
						, avatar
						, name
						, email
					;

					if( nameAndEmail_parts ) {
						name = nameAndEmail_parts[1];
						email = nameAndEmail_parts[2];
						avatar = mailru.Utils.getAvatarSrc(email, name, 32, null);
					}
					else {
						name = item;
						email = "";
						avatar = mailru.Utils.getAvatarSrc(item, "", 32, null);
					}

					return "<div data-suggest='" +  ajs.$.quote( ajs.Html.escape(item) ) + "' class='addressbook__suggest__item' data-suggest-idx=''>" +
						(
							tick(name) + ' ' +
								'<span class="addressbook__suggest__item__hint">' +
									( email ? tick(email) : "&nbsp;" ) +
								'</span>'
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
		, RE_NAME_AND_EMAIL_IN_LTGT = new RegExp("[\"']?(.*?)[\"']?\\s*(?:<|&lt;)(" + RE_EMAIL.source + ")(?:>|&gt;)$")
		, RE_NAME_AND_EMAIL_IN_LTGT_WITH_SPACE = new RegExp("[\"']?(.*?)[\"']?\\s+(?:<|&lt;)(" + RE_EMAIL.source + ")(?:>|&gt;)$")
		, RE_SEPARATOR = /,\s*/g
		;

	// https://jira.mail.ru/browse/MAIL-18309
	// RE_NAME_AND_EMAIL_IN_LTGT отличается от той, что в addressbookSuggest.js, \s* вместо \s+

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
						, avatar
						, name
						, email
					;

					if( nameAndEmail_parts ) {
						name = nameAndEmail_parts[1];
						email = nameAndEmail_parts[2];
						avatar = mailru.Utils.getAvatarSrc(email, name, 32, null);
					}
					else {
						name = item;
						email = "";
						avatar = mailru.Utils.getAvatarSrc(item, "", 32, null);
					}

					return "<div data-suggest='" +  ajs.$.quote( ajs.Html.escape(item) ) + "' class='addressbook__suggest__item' data-suggest-idx=''>" +
						(
							'<div class="addressbook__suggest__item__text">' +
								tick(name) + ' ' +
								'<span class="addressbook__suggest__item__hint">' +
									( email ? tick(email) : "&nbsp;" ) +
								'</span>' +
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
			__construct: function(input, namespace, opts) {
				this.opts = Object.extend({}, _getOpts(), opts);
				this.namespace = namespace;

				this._prepareContainer($(input));
				this._initSuggests();
				this._initHandlers();
				this._initHistory();
				this._initWidget();
				this._initLabels();
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
						'tabindex': -1
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
					Array.forEach(words, function(str) {
						this._createLabel(str, true);
					}.bind(this));
					this._updateSource();
				}
			},

			_initSuggests: function() {
				var t = this;

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
				this.suggest.ajsSuggest.addTrigger('suggests:activeOut', function(e) {
					// аналог blur, но не вызывается по клику на список саджестов.
					if (t.opts.noblur) {
						t.opts.noblur = false;
					}
					else {
						t._createLabel(t.input.value);
						t.input.value = '';
					}
				});

				this.$input
					.bind('blur', function(e, force) {
						// при потере фокуса создаем из инпута лейбл
						// только если вызвали вручную, в штатных случаях - сработает suggests:activeOut
						if (force) {
							t._createLabel(this.value);
							this.value = '';
							if (t.suggest.isExpanded()) {
								t.suggest.hide();
							}
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
						else if ( ((keyCode == 37 || keyCode == 8) && (!caret.start && !caret.end))) {
							// left или backspace в начале строки
							var $prev = t._getPrevLabel(t._getInputWrap());
							if($prev.length) {
								if (mailru.ComposeLabelsOneClick && keyCode == 8) {
									// по backspace просто удаляем предыдущий лейбл
									t._removeLabel($prev);
								} else {
									// уходим из инпута и выделяем предыдущий лейбл
									$(this).trigger('blur', true);
									if (e.shiftKey)
										t._selectLabel($prev, true);
									else
										$prev.click();
								}
								e.preventDefault();
							}
						}
						else if ( (keyCode == 39 && caret.start == this.value.length)/* || keyCode == 9*/) { // right или tab
							var $next = t._getNextLabel(t._getInputWrap());
							if ($next.length) {
								// уходим из инпута и выделяем следующий лейбл
								$(this).trigger('blur', true);
								if (e.shiftKey)
									t._selectLabel($next, true);
								else
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
										t._createLabel(str, true);

									}
								});
								t._prepareInput();
								t._updateSource();
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
							if (isCtrlKey(e) || e.shiftKey) {
								if ($label.hasClass('compose__labels__label_selected')) {
									// убираем выделение
									e.shiftKey ? t._deselectLabelsRange($label) : t._deselectLabel($label);
								}
								else {
									// добавляем к выделенным
									e.shiftKey ? t._selectLabelsRange($label) :  t._selectLabel($label, true);
								}
							}
							else {
								t._selectLabel($label);
							}
							e.preventDefault();
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

						if (keyCode == 37 || keyCode == 39) { // left, right, tab
							// selection
							var   multiple =  e.shiftKey // shift+стрелки - нужно добавить к выделению
								, isRight = keyCode == 39; // right, tab - вправо, left, shift+tab - влево

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
						else if (e.shiftKey && (keyCode == 38 || keyCode == 40)) {
							// запрещаем shirt+вверх/вниз
							e.preventDefault();
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
						else if (keyCode == 9) { // tab
							t._deselectAllLabels();
						}
						else if (isCtrlKey(e) && keyCode == 65) { // ctrl+a
							t._selectAllLabels();
							e.preventDefault();
						}
						else if (isCtrlKey(e) && (keyCode == 67 || keyCode == 88)) { // ctrl+c, ctrl+x
							t._prepareLabelsForCopy($selectedLabel);

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
				this.$container.bind('mousedown', function(e) {
					var $target = $(e.target);
					if ($target.is('.js-remove-label') && $target.closest('.js-input-wrap').length) {
						t.opts.noblur = true;
					}
				});

				if (!mailru.ComposeLabelsOneClick) { // https://jira.mail.ru/browse/MAIL-14941
					this.$container.delegate('.js-compose-label', 'dblclick', function(e) {
						// редактирование
						t._prepareInput($(e.target).closest('.js-compose-label'));
						e.preventDefault();
					});
				}

				if ($.browser.msie) {
					// отмена выделения текста по нажатию на лейблы в ие
					this.$container.delegate('.js-compose-label', 'selectstart', function(e) {
						e.preventDefault();
					});
				}

				// выделение мышью
				this.$container.bind('mousedown', function(e) {
					// если нажали не на лейбл, то пробуем выделить все
					var   $target = $(e.target)
						, $label = $target.closest('.js-compose-label');

					if (!$label.length && !t.$input.val()) {
						// если нажали не на лейбле и в инпуте нету текста, то можно мышью выделить лейблы
						e.preventDefault();

						var startPoint = {x: e.pageX, y: e.pageY}
							, $labels = t._getLabels().filter(':visible')
							, map = mapLabels($labels)
							, hasSelection = false;

						t._deselectAllLabels();
						t.opts.preventTooltips = true; // чтобы не появлялись тултипы
						// так как mousedown запревенчен, надо вручную заблюрить все инпуты
						if (mailru.ComposeLabelsInstances) {
							Array.forEach(mailru.ComposeLabelsInstances, function(item) {
								if (item.is(':visible')) {
									var widget = item.composeLabels('widget');
									if (widget)
										widget.blur();
								}
							});
						}
						else {
							t.$input.trigger('blur', true);
						}

						$(document)
							.bind('mousemove.selection', function(e) {
								// все пересекающиеся с областью выделения лейблы нужно выделить
								var selection = {
									x: Math.min(startPoint.x, e.pageX)
									, y: Math.min(startPoint.y, e.pageY)
									, w: Math.abs(startPoint.x - e.pageX)
									, h: Math.abs(startPoint.y - e.pageY)
								};
								// каждый раз идем по всему списку лейблов и сравниваем их координаты
								// , если они хоть как-то пересекаются с областью выделения, то помечаем их выделенными
								Array.forEach(map, function(item, k) {
									if (   ((item.x < selection.x && (item.x + item.w) < selection.x)
										    || (item.x > (selection.x + selection.w) && (item.x + item.w) > (selection.x + selection.w)))
										|| ((item.y < selection.y && (item.y + item.h) < selection.y)
										   || (item.y > (selection.y + selection.h) && (item.y + item.h) > (selection.y + selection.h)))
										) {
										// outside
										item.$label.removeClass('compose__labels__label_selected');
									}
									else {
										if (!hasSelection) hasSelection = true;
										// inside
										item.$label.addClass('compose__labels__label_selected');
									}
								});
							})
							.bind('mouseup.selection', function(e) {
								$(document).unbind('mousemove.selection mouseup.selection');
								t.opts.preventTooltips = false;
								// чтобы дальше можно было выделять клавиатурой или с шифтом мышью, нужно назначить последний выбранный лейбл
								t.$lastSelectedLabel = t._getSelectedLabel().first().focus();
								if (!hasSelection) {
									// если так ничего и не выбрали, то передаем фокус в инпут (как и по клику в пустое место)
									t._prepareInput();
								}
							});
					}

					/**
					 * @private Собираем один раз координаты и размеры всех лейблов, чтобы не узнавать их на каждый mousemove
					 * @param $labels
					 * @returns {Array}
					 */
					function mapLabels($labels) {
						var map = [], $label, offset ;
						Array.forEach($labels, function(label) {
							$label = $(label);
							offset = $label.offset();
							map.push({
								$label:$label
								, x: offset.left
								, y: offset.top
								, w: $label.outerWidth()
								, h: $label.outerHeight()
							});
						});
						return map;
					}
				});

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
						t.opts.inputMaxWidth = t.$container.width() - 24;
						t.$input.css('max-width', t.opts.inputMaxWidth + 'px');
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

						memento = memento.replace(/,\s*$/,''); // удаляем последнюю запятую (если есть)

						if (current !== null) {
							if (memento != current) {
								pointer = ++this.pointer;
								stack.splice(pointer, stack.length - pointer, memento);
							}
						} else {
							stack.push(memento);
							this.pointer++;
						}
					},
					undo : function() {
						var prev = this._getState(this.pointer - 1);
						if (prev !== null) {
							this.pointer--;
						}
						return prev;
					},
					redo: function() {
						var next = this._getState(this.pointer + 1);
						if (next !== null) {
							this.pointer++;
						}
						return next;
					},
					clear: function () {
						this.stack = [];
						this.pointer = -1;
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
						t.history.clear();
						// init new
						t._initLabels();
						// clearCounter
						this.invalidLabelCounted = false;
					},

					isValid: function() {
						// проверим, нет ли невалидных лейблов
						return !t._getLabels().filter('.compose__labels__label_invalid').length;
					},

					blur: function() {
						t.$input.trigger('blur', true);
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
				if (texts.length == 1) {
					texts[0] += ',';
				}
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
						if (!str.match(RE_NAME_AND_EMAIL_IN_LTGT_WITH_SPACE)) { // MAIL-18309
							$label.data('text', (name + ' <' + email + '>'));
						}
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
//				ajs.log('_prepareInput',$label);
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
					var currentMaxWidth = $label[0].style['max-width'] || $label[0].style['maxWidth'];
					if (currentMaxWidth) {
						$label
							.data('max-width', currentMaxWidth)
							.css('max-width',8000+'px');
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

				// инпуту ставится избыточная ширина (indent)
				// поэтому если ничего не делать, при редактировании блока его крестик съедет вправо
				// Чтобы этого избежать, инпуту при редактировании вешается стилями отрицательный правый маржин
				// но если мы приближаемся к максимальной ширине инпута, этот маржит задвигает крестик на инпут
				// поэтому здесь мы проверяем что ширина превышает максимальную,
				// и уменьшаем правый маржин обратно до нуля. а если не надо, то сбрасываем.
				if (this.$input.closest('.js-input-wrap').length && cloneWidth + indent > this.opts.inputMaxWidth) {
					var diff = cloneWidth - this.opts.inputMaxWidth;
					if (diff <= 5 || !(this.$input[0].style['margin-right'] || this.$input[0].style['marginRight'])) {
						this.$input.css('margin-right', Math.min(diff,5) + 'px');
					}
				}
				else if (this.$input[0].style['margin-right'] || this.$input[0].style['marginRight']) {
					this.$input.css('margin-right', '');
				}
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
//				ajs.log('_createLabel',str);
				str = str
					.replace(/(^\s+|\s+$)/g, '')
					.replace(/(^,*|,*$)/g,'');

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

					if (!_hasEmail(str)) {
						// лейбл без емейла, помечаем его как невалидный
						$label.addClass('compose__labels__label_invalid');
						if (!this.invalidLabelCounted) {
							Counter.d(1708699);
							this.invalidLabelCounted = true; // считаем только 1 раз
						}
					}
					else if (_suggestToEmail(str) == str && str != str.match(RE_EMAIL)[0]) {
						// текст состоит не только из емейла, но еще содержит имя, но емейл не обернут в скобки
						var endIndex = str.length
							, startIndex = str.lastIndexOf(" ") + 1
							, found = false;

						while (!found) {
							if (str.substring(startIndex, endIndex).match(RE_EMAIL)) {
								found = true;
							}
							else {
								endIndex = startIndex - 1; // минус пробел
								startIndex = str.substring(0, endIndex).lastIndexOf(" ") + 1;
							}
							if (endIndex <= 0) {
								break;
							}
						}

						if (found) {
							if (endIndex < str.length) {
								// после емейла еще какой-то текст, создаем из него новый лейбл
								var newStr = str.substring(endIndex);
								setTimeout(function() {
									this._createLabel(newStr);
								}.bind(this), 1);
							}

							str = str.substring(0, startIndex)
								+ ' <' + str.substring(startIndex, endIndex) + '>';

							// обновляем текст
							$label
								.data('text',str)
								.find('.js-label-text').text(str);
						}

					}

					// скрываем емейл для адресов из АК
					var labelText = this._suggestToABName($label, str);

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
				else if (this.$input.closest('.js-input-wrap').length) {
					var $wrap = this.$input.closest('.js-input-wrap');
					this.$container.append(this.$input);
					this._removeLabel($wrap, true);
				}
			},

			//*** удаление лейблов ******

			_removeLabel: function($label, immediately) {
//				ajs.log('_removeLabel',$label,immediately);
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

			/*
			 * развыбирает диапазон лейблов от заданного до $lastSelectedLabel
			 * включительно
			 */
			_deselectLabelsRange: function($label) {
				if (!this.$lastSelectedLabel) {
					// no selected labels
					this._deselectLabel($label);
					return;
				}

				var $labels = this._getLabels().filter(':visible')
					, startDeselection = false
					, endDeselection = false
					, currentLabel
					, cutFromRight
					;

				for (var i = 0; i < $labels.length; i++) {
					currentLabel = $labels[i];

					if (currentLabel == $label[0] || currentLabel == this.$lastSelectedLabel[0]) {
						endDeselection = startDeselection; // не пора ли заканчивать
						startDeselection = !startDeselection; // пора начинать
						if (startDeselection)
							cutFromRight = (currentLabel == $label[0]); // развыбираем вправо от кликнутого
					}

					if (startDeselection || endDeselection)
						this._deselectLabel($(currentLabel));

					if (endDeselection)
						break;
				}

				var $nextLabel = cutFromRight ? this._getPrevLabel($label) : this._getNextLabel($label);
				this.$lastSelectedLabel = ($nextLabel.hasClass('compose__labels__label_selected')) ? $nextLabel : null;
			},

			_selectAllLabels: function() {
				this._getLabels()
					.filter(':visible')
					.addClass('compose__labels__label_selected')
					.last()
					.focus();

				if ($.browser.safari) {
					this._prepareLabelsForCopy(this._getSelectedLabel());
				}
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
					// сразу переходим в редактирование
					this._prepareInput($label);
				}
				else {
					this.$lastSelectedLabel = $label.addClass('compose__labels__label_selected').focus();
				}

				if ($.browser.safari) {
					this._prepareLabelsForCopy(this._getSelectedLabel());
				}
			},

			/*
			 * выбирает диапазон лейблов от заданного до $lastSelectedLabel
			 */
			_selectLabelsRange: function($label) {
				if (!this.$lastSelectedLabel) {
					// no selected labels
					this._selectLabel($label, true);
					return;
				}

				var $labels = this._getLabels().filter(':visible')
					, startSelection = false
					, endSelection = false
					, currentLabel
					;

				for (var i = 0; i < $labels.length; i++) {
					currentLabel = $labels[i];

					if (currentLabel == $label[0] || currentLabel == this.$lastSelectedLabel[0]) {
						endSelection = startSelection; // не пора ли заканчивать
						startSelection = !startSelection; // пора начинать
					}

					if (startSelection || endSelection)
						$(currentLabel).addClass('compose__labels__label_selected');

					if (endSelection)
						break;
				}

				this.$lastSelectedLabel = $label;
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

			_prepareLabelsForCopy: function($labels) {
				var text = this._getText($labels);
				// отдаем фокус в ксерокс, браузер скопирует нужный текст из него
				this.$xerox
					.val(text)
					.focus()
					.select();
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
				if (~this.opts.toolTipShowTimeout) {
					clearTimeout(this.opts.toolTipShowTimeout);
					this.opts.toolTipShowTimeout = -1;
				}

				if (this.opts.preventTooltips || this.suggest.isExpanded() || !$label.data('tooltip')) {
					// занято
					return;
				}

				this.opts.toolTipShowTimeout = setTimeout(function() {
					// показываем тултип с задержкой, чтобы избежать показа по случайному проводу мышки
					this.opts.toolTipShowTimeout = -1;

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
						.fadeIn('fast');

				}.bind(this), 500);


			},

			_hideTooltip: function(immediately) {
				if (~this.opts.toolTipShowTimeout) {
					clearTimeout(this.opts.toolTipShowTimeout);
					this.opts.toolTipShowTimeout = -1;
				}
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
					, dragAreaBackground /* for ie and opera */
					, currentDraggedItem = null
					, IS_POINER_EVENTS_SUPPORT = (function() {
						//https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css-pointerevents.js
						var element = document.createElement('x')
							, documentElement = document.documentElement
							, getComputedStyle = window.getComputedStyle
							, supports
							;

						if(!getComputedStyle || !('pointerEvents' in element.style)){
							return false;
						}

						element.style.pointerEvents = 'auto';
						element.style.pointerEvents = 'x';
						documentElement.appendChild(element);
						supports = getComputedStyle &&
							getComputedStyle(element, '').pointerEvents === 'auto';
						documentElement.removeChild(element);

						return !!supports;
					})()
					;

				function startDrag($item) {
					var $clone = getClone($item);

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
							if (dragAreaBackground) {
								dragAreaBackground.remove();
							}
							e.preventDefault();
							dragListener
								.unbind('mousemove'+namespace)
								.unbind('mouseup'+namespace)
								.unbind('dragstart'+namespace+' drag'+namespace)
							;

							endDrag(getDropTarget(e),$item);
						})
						.bind('dragstart'+namespace+' drag'+namespace, function(e) {
							// prevent default dragndrop
							e.preventDefault();
						})
					;

					if (!IS_POINER_EVENTS_SUPPORT && !dragAreaBackground) {
						// create layer to prevent iframes from catching mouse
						dragAreaBackground = $('<div></div>')
							.css({
								position: 'absolute'
								, left: 0
								, top: 0
								, width: 100+'%'
								, height: 100+'%'
								, zIndex: 49999
								, 'background-color': '#000'
								, opacity: 0.001
							});
					}

					if(dragAreaBackground) {
						dragArea.append(dragAreaBackground);
					}

					// prevent selection and iframe catching in modern browsers
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
						// на самом деле мы могли таскать не один итем а все выделенные
						// поэтому используем их
						$item = t._getSelectedLabel();
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
								blurInputs(); // simulate mousedown;

								dragListener.unbind('mousemove'+namespaceDragStart);
								dragListener.unbind('mouseup'+namespaceDragStart);
								dragListener.unbind('selectstart'+namespaceDragStart);
								currentDraggedItem = startDrag($item);
							}
						})
						.bind('mouseup'+namespaceDragStart, function(e) {
							blurInputs(); // simulate mousedown;
							// cancel
							dragListener.unbind('mousemove'+namespaceDragStart);
							dragListener.unbind('mouseup'+namespaceDragStart);
							dragListener.unbind('selectstart'+namespaceDragStart);
//							setDocumentSelection('');
						})
						.bind('selectstart'+namespaceDragStart, function(e) {

							e.preventDefault();
						})
					;

//					setDocumentSelection('none');
				}

				function getMousePosition(e, $item) {
					var offset = $item.offset();
					return {left: (e.pageX + ajs.scrollLeft() - offset.left || 0), top: (e.pageY + ajs.scrollTop() - offset.top || 0)};
				}

				/**
				 * @param $item - лейбл по которому кликнули
				 */
				function getClone($item) {
					var $clone;
					// если выделенных лейблов много, то надо их добавить
					// если только этот, то просто клоним его.

					// add current item to selection
					t._selectLabel($item, true);
					var selectedLabels = t._getSelectedLabel();
					if (selectedLabels.length > 1) {
						$clone = $('<div></div>')
							.width( $item.outerWidth() )
							.append(
								$item.clone()
									.addClass('compose__labels__drag')
									.css({
										top: 0
										, left: 0
										, 'z-index': 100
										, margin: 0
									})
							)
							.append(
								$('<div class="compose__labels__label compose__labels__drag"></div>')
									.css({
										height: '19px'
										, top: 4
										, left: 4
										, right: 4
										, 'z-index': 99
										, margin: 0
										, padding: 0
									})
								, (selectedLabels.length > 2) ?
									$('<div class="compose__labels__label compose__labels__drag"></div>')
										.css({
											height: '19px'
											, top: 8
											, left: 8
											, right: 8
											, 'z-index': 98
											, margin: 0
											, padding: 0
										})
									: null
							)
							.append(
								$('<div class="compose__labels__drag__cnt">'+selectedLabels.length+'</div>')
							)
							.data('text',t._getText(selectedLabels));
					}
					else {
						// only 1 item - clone it
						$clone = $item.clone();
					}

					// css
					var offset = $item.offset();

					$clone.css({
						position: 'absolute'
						, left: (offset.left)+'px'
						, top: (offset.top) + 'px'
						, zIndex: 50000
						, 'pointer-events': 'none'
					});

					return $clone;
				}

				function getDropTarget(e) {
					var $target = $(e.target);
					if (IS_POINER_EVENTS_SUPPORT) {
						$target = $(document.elementFromPoint(e.pageX, e.pageY));
					}
					else {
						Array.forEach(mailru.ComposeLabelsInstances, function(item) {
							if (item.is(':visible')) {
								var offset = item.offset()
									, x = offset.left - ajs.scrollLeft()
									, y = offset.top - ajs.scrollTop()
									;

								if (   e.pageX >= x
									&& e.pageY >= y
									&& e.pageX <= x + item.width()
									&& e.pageY <= y + item.height() )
								{
									$target = item;
									return false;
								}
							}
						});
					}
					return $target;
				}

				function setDocumentSelection(value) {
					// todo: если выделение не появляется, можно удалить этот метод совсем.
					// in chrome sometimes selection occur despite we prevent it. so disable it with styles
//					$(document.body).css({
//						'-webkit-user-select':	value
//						,'-moz-user-select':	value
//						,'-khtml-user-select':	value
//						,'-ms-user-select':		value
//						,'user-select':			value
//					});
				}

				function blurInputs() {
					Array.forEach(mailru.ComposeLabelsInstances, function(item) {
						if (item.is(':visible')) {
							var widget = item.composeLabels('widget');
							if (widget)
								widget.blur();
						}
					});
				}

				// some public functions
				this.$container.data(this.namespace,
					Object.extend({}, t.$container.data(this.namespace),
						{
							drop: function($item) {
								// droptarget
								// todo анимация
								var $source = t.$source;
								$source.val($source.val() + ', '+t._getText($item));
								t._initLabels();
								t._prepareInput();
							},

							toggleDragNDrop: function(on) {
								t.opts.dragNDropEnabled = (on == true);
							}
						}));

				// listen to drag init
				this.$container.delegate(draggableElement, 'mousedown', function(e) {
					if ( mailru.ComposeLabelsDnd
						&& t.opts.dragNDropEnabled && !currentDraggedItem
						&& e.which == 1 ) {

						e.preventDefault();

						var $item = $(e.target).closest(draggableElement);
						$item.mousePosition = getMousePosition(e, $item);
						dragWait($item);
					}
				});

				// список возможных таргетов для ие
				if (mailru.ComposeLabelsInstances === undefined) {
					mailru.ComposeLabelsInstances = [];
				}
				mailru.ComposeLabelsInstances.push(this.$container);
			}

		})
	;

	jsLoader.loaded('{mailru.ui}mailru.ui.ComposeLabels', 1);

// data/ru/images/js/ru/ui/mailru.ui.ComposeLabels.js end

(function($) {
		var namespace = 'composeLabels' + $.expando;

		$.fn.composeLabels = function(param) {
			if (param === 'widget') {
				return this.data(namespace);
			}
			else {
				return this.each(function() {
					var composeLabels = new mailru.ui.ComposeLabels(this, namespace, param);
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
							$inp.composeLabels({blockMaxWidth: 150});
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
							$inp.addressbookSuggest({width: "322px"});
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

(function (){
		var ui = {
			wrap: function (view, folders){
				var
					  form = $('#settings-form-edit-filter', view)
					, forwardEmailContainer = form.find('.js-forward-email-container')
					, conditionsContainer = form.find('.js-conditions-container')
				;

				$('.form__select', view).form__select();

				$('.js-action-forward-input', view).expandField({ rows: 5, parent: 'body' });

				initDropdowns(form);

				updateConditionControls();
				mailru.ui.Options.checkedDropdown({
					container: form.find('.js-checked-dropdown'),
					allText: Lang.get('options.filters.all_folders'),
					onToggle: function(show, target) {
						// set dropdown width for ie7
						var $parent = target.$parent? target.$parent : target.$container.parent();
						if ($parent)
						target.$container.css({
							'width': $parent.width()
						});
					}
				});
				initConditions(conditionsContainer);

				$('.form__select').each(function() {
					function updateValues() {
						var item = list.find('.js-selected');
						if (!item.length) {
							item = list.find('.js-list-item').first();
						}
						field.val(item.attr('data-value'));
						text.text(item.attr('data-name'));
					}

					// mail-8484 create folder from dropdown
					function checkFoldersSelect() {
						if(field.val() == 'create_new')
						{
							// show popup to add folder
							LayerManager.show('settings__folders__edit', {
								foldersList: getFoldersList(),
								success: function(form, newfolderid) {
									if ( newfolderid == null ) {
										// without new folder id we cannot set filter to this folder, so reload page
										document.location.reload();
									}
									else {
										try {
											addNewFolder({
												name: $(form[0]).find('input[name="Name"]').val(),
												parentid: $(form[0]).find('select[name="parentid"]').val(),
												id: newfolderid
											});
										}
										catch (e){
											document.location.reload();
										}
									}
								}
							});
							return false;
						}
					}

					function addNewFolder(newFolder) {

						//newFolder.name = ajs.Html.escape(newFolder.name);

						var neighbours = [newFolder.name],
							isSubfolder = (newFolder.parentid != "top" && !isNaN(parseInt(newFolder.parentid)) ),
							newOption = getNewItem(ajs.Html.escape(newFolder.name), newFolder.id, isSubfolder);

						if (!isSubfolder)
							newFolder.parentid = "-1";

						// find new folder's place
						for (var id in folders) if (folders.hasOwnProperty(id)) {
							var folder = folders[id];
							if (id == 0 || id == 950 || id == 500000 || id == 500001 || id == 500002 || id == 500003 || id == 500005)
								continue;

							if (newFolder.parentid == folder.parentId) {
								neighbours.push(folder.name);
							}
						}
						neighbours.sort(sortByName);

						var folderIndex = neighbours.indexOf(newFolder.name);
						var nextItemId = 500000;
						// insert new option

						if(folderIndex < neighbours.length-1){
							// insert before  neighbour
							var folderName = neighbours[folderIndex+1];

							list.find('.js-list-item[data-name="' + folderName + '"]').before(newOption);
							nextItemId = list.find('.js-list-item[data-name="' + folderName + '"]').attr('data-value');
						}
						else {
							if (newFolder.parentid == "-1") {

								// folder on top, insert before system folders
								var systemFolder = list.find('.js-list-item[data-value="'+500000+'"]');
								nextItemId = 500000;

								if (systemFolder.length == 0) { // in case sent folder is missing, insert before spam
									systemFolder = list.find('.js-list-item[data-value="'+950+'"]');
									nextItemId = 950;
								}
								systemFolder.before(newOption);
							}  else {
								// the only child, find his parent
								list.find('.js-list-item[data-value="'+newFolder.parentid+'"]').after(newOption);
							}
						}

						// clear selected
						$('.js-list-item', list).removeClass('js-selected');

						// mark current as selected
						list.find('.js-list-item[data-name="'+newFolder.name+'"]').addClass('js-selected');
						updateValues();

						// add to folders list
						var newFolders = {};

						for (var id in folders) if (folders.hasOwnProperty(id)) {
							if (id == nextItemId) {
								newFolders[newFolder.id]= {
									id:          newFolder.id,
									name:        newFolder.name,
									canBeParent: !isSubfolder,
									subfolder:   isSubfolder,
									parentId:    newFolder.parentid
								};
							}
							newFolders[id] = folders[id];
						}

						folders = newFolders;
					}

					function sortByName(a,b) {
						a = a.toUpperCase();
						b = b.toUpperCase();
						return (a == b) ? 0 : ( (a > b) ? 1 : -1 );
					}

					function getNewItem(name, id, isSubfolder) {
						return '<label class="form__dropdown__item js-list-item" data-name="' + name + '" data-value="' + id + '">' +
							(isSubfolder? '&nbsp;&nbsp;&nbsp;&nbsp;' : '') + name +
							'</label>';
					}

					var container = $(this),
						list = container.find('.js-select-list'),
						text = container.find('.js-text'),
						field = $('input[name="Actions_move_Param"]', container);


					if (list.length) {
						container.dropdown({
							'link': '.js-select-link',
							'container':'.js-select-list',
							'onToggle': (function() {
								return function(isOpening, scope) {
									return !container.hasClass('form__select_disabled');
								}
							})(),
							'onClick': (function(){
								return function(evt, scope) {
									// get selected item
									var item = $(evt.target).closest('.js-list-item');
									// clear selected
									$('.js-list-item', list).removeClass('js-selected');
									// mark current as selected
									item.addClass('js-selected');
									// update field values
									updateValues();

									checkFoldersSelect();
									scope.hide();
									evt.preventDefault();
								}
							})()
						});

						updateValues();
					}
				});

				var continueCheckbox = form.find('.js-continue-checkbox');
				continueCheckbox.change(function(e) {
					form.find('.js-last-value').val(continueCheckbox.is(':checked') ? 0 : 1);
				});

				form.find('input[name="RuleAction"]')
					.change(function() {
						var move = form.find('.js-action-moveto:checked').length;
						form.find('.js-moveto-select')
							.add(form.find('.js-moveto-actions'))
							.form__toggle(move);
						form.find('.js-action-moveto-value').val(move ? 1 : 0);
						form.find('.js-action-drop-value').val(move ? 0 : 1);
						form.find('.js-continue-checkbox-field').form__toggle(move);
						if(!move && continueCheckbox){
							continueCheckbox.attr('checked', false);
							continueCheckbox.triggerHandler('change');
						}
					})
					.triggerHandler('change');

				form.find('input[name="Reply"]')
					.change(function() {
						form.find('.js-replywith-container').form__toggle($(this).is(':checked'));
						form.find('input[name="ReplyWith"]').triggerHandler('change');
					})
					.triggerHandler('change');

				form.find('input[name="ReplyWith"]')
					.change(function() {
						var container = form.find('.js-replywith-message-container'),
							field = container.find('textarea'),
							enabled = form.find('.js-replywith-message:checked').length;
						container[enabled ? 'slideDown' : 'slideUp']();
						if (isReplyWithMessage())
							field.removeAttr('disabled');
						else
							field.attr('disabled', 'disabled');
						form.find('.js-replywith-reply-value').val(enabled ? 1 : 0);
						form.find('.js-replywith-reject-value').val(enabled ? 0 : 1);
					})
					.triggerHandler('change');

				form.find('.js-action-forward')
					.change(function() {
						var enabled = $(this).is(':checked');
						forwardEmailContainer.form__toggle(enabled);
						form.find('.js-action-forward-value').form__toggle(enabled);
						form.find('.js-action-notify-value').form__toggle(enabled);
						if( enabled ) {
							forwardEmailContainer
								.css('position','')
								.find('.js-mouse').remove();
						}
						else {
							forwardEmailContainer.find('.js-action-forward-input').val('');

							forwardEmailContainer
								.css('position','relative')
								.find('.js-action-forward-input')
								.after(function() {
									return $('<div/>')
										.addClass('js-mouse')
										.css({position:'absolute', top:0, height:'100%', left:0, width:'100%', background:'#ffffff', opacity:0, cursor:'pointer'});
								});
						}
					})
					.triggerHandler('change');

				form.delegate('js-mouse', 'click', function(e) {
					forwardEmailContainer.click();
				});

				form.find('input[name="Apply"]')
					.change(function() {
						var enabled = $(this).is(':checked');
						form.find('.js-apply-container')
								.form__toggle(enabled)
								.find('input[type="select"]')
									.css('z-index', (enabled ? '' : '0'));
					})
					.triggerHandler('change');

				form.find('.js-apply-container').click(function() {
					if ( $(this).hasClass('form_disabled') ) {
						form.find('input[name="Apply"]')
								.click()
								.triggerHandler('change');
					}
				});


				form.delegate('.js-add-condition', 'click', function() {
					var conditions = form.find('.js-condition-container');

					var newCondition = $($.tpl('#settings__filters__condition_ejs', {
						first: !conditions.length
					}));
					initDropdowns(newCondition);
					conditionsContainer.append(newCondition);

					newCondition.slideDown('fast');
					updateFieldNames($(conditions.selector));
					initConditions(newCondition);

					updateConditionControls();

					// mail-10002 set focus into new condition text
					$(':text, textarea', newCondition).first().focus();

					return false;
				});

				form.delegate('.js-remove', 'click', function(e) {
					var container = $(e.target).closest('.js-condition-container');
					container.fadeOut('fast', function() {
						container.remove();
						updateConditionControls();

						var conditions = form.find('.js-condition-container');
						updateFieldNames(conditions);
					});
					return false;
				});

				forwardEmailContainer.add(form.find('.js-forward-notify-dropdown .form__dropdown__item'))
					.click(function() {
						if (forwardEmailContainer.hasClass('form_disabled')) {
							form.find('.js-action-forward')
								.click()
								.triggerHandler('change');
							// set focus
							forwardEmailContainer.find('.js-action-forward-input:first').trigger('focus');
						}
					});

				//=== hide some actions
				form.find('.js-otherActions').click(function() {
					$(this).remove();
					form.find('.js-otherActions-container').show();
				});

				form.submit(function() {
					if (
						form.find('.js-action-moveto:checked').length &&
						form.find('input[name="Actions_move_Param"]').val() == 0 &&
						!form.find('.js-action-read:checked').length &&
						!form.find('.js-action-flag:checked').length &&
						!form.find('.js-action-forward:checked').length &&
						!form.find('.js-action-reply:checked').length
					) {
						var message = $('.form__top-message_error', view),
							text = message.find('.form__top-message__text');
						text.html(Lang.get('options.filters.error.no-actions'));
						message.show();
						message[0].scrollIntoView();
						return false;
					}

					var requiredFields = [],
						patternFields = [];

					var conditions = form.find('.js-condition-container');
					conditions.each(function() {
						var field = $(this).find('.js-value');
						if (!field.val()) {
							requiredFields.push({
								name: field.attr('name')
							});
						}
					});

					if (form.find('.js-action-forward:checked').length) {
						requiredFields.push({
							name: 'Actions_forward_Param'
						});
					}

					if (isReplyWithMessage()) {
						requiredFields.push({
							name: 'Actions_reply_Param'
						});
					}

					// User can't forward messages to his own address
					var validForwardEmails = [],
						forwardEmailField = form.find('.js-action-forward-input'),
						forwardEmails = forwardEmailField.val();
					if(forwardEmails) {
						forwardEmails = forwardEmails.split(/,\s*/);

						// mail-8535 p.1
						var mailParts = mailru.useremail.split("@");
						if (mailParts.length == 2 && mailParts[1] === "mail.ru")
							var mailUsername = mailParts[0];

						var regexp = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z0-9]{2,6}$/; // MAIL-10766

						for (var emailIdx = 0; emailIdx < forwardEmails.length; emailIdx++) {
							var email = forwardEmails[emailIdx].replace(/\s/g, '');
							if (email !== mailru.useremail && (!mailUsername || email !== mailUsername) && regexp.test(email) ) {
								validForwardEmails.push(email);
							}
						}
					}

					if (validForwardEmails.length) {
						forwardEmailField.val(validForwardEmails);
					}
					else {
						patternFields.push({
							name: 'Actions_forward_Param',
							error: Lang.get('options.filters.error.wrong_email')
						});
					}

					return CheckForm(form[0], requiredFields, patternFields);
				});

				mailru.ui.Options.init();

				// mail-10002 set focus
				setTimeout(function() {
					$(':text,:checkbox,:radio, textarea', view).first().focus();
				}, 250);


				function initConditions(contaner) {
					var baseName = contaner.find('.js-value').first().attr('data-base-name'); //mail-8535
					contaner.find('.js-value').expandField({ rows: 5, parent: 'body' });
					contaner.find('.js-value').attr('data-base-name', baseName); // add custom attribute

					/** @namespace mailru.ui.Options._dataChanged */
					contaner.find('input,select,textarea').bind('change input', $.proxy(mailru.ui.Options._dataChanged, mailru.ui.Options));
					contaner.find('.form__dropdown__item').bind('click', $.proxy(mailru.ui.Options._dataChanged, mailru.ui.Options));
				}

				function initDropdowns(container) {
					container.find('.js-dropdown')
						.dropdown({
							link: '.js-link',
							container: '.js-menu',
							onClick: function(e) {
								Dropdown.hide(this.group);
								var item = $(e.target),
									id = item.attr('data-id'),
									dropdown = item.closest('.js-dropdown'),
									input = dropdown.find('.js-input');

								if (input.attr('data-base-name') == 'Field') {
									var container = dropdown.closest('.js-condition-container'),
										containsToggle = container.find('.js-toggle-contains'),
										containsToggleItems = containsToggle.find('.js-item');
									if (id === 'Size') {
										containsToggleItems.eq(0).html(Lang.get('options.filters.less_than'));
										containsToggleItems.eq(1).html(Lang.get('options.filters.greater_than'));
									}
									else {
										containsToggleItems.eq(0).html(Lang.get('options.filters.contains'));
										containsToggleItems.eq(1).html(Lang.get('options.filters.not_contains'));
									}
									containsToggle.find('.js-link').text( containsToggleItems.filter('[data-id="' + containsToggle.find('.js-input').val() + '"]').first().text() );
								}

								dropdown.find('.js-text').text(item.html());
								input.val(id);
								return false;
							}
						})
						.each(function() {
							var dropdown = $(this),
								items = dropdown.find('.form__dropdown__item'),
								value = dropdown.find('.js-input').val(),
								selectedItem = $(this).find('.form__dropdown__item').filter('[data-id="' + value + '"]');
							if (!selectedItem.length)
								selectedItem = items.first();
							selectedItem.trigger('click');
						});

					// toggle with 2 values
					container.find('.js-toggle')
						.each(function() {
							var wrapper = $(this),
								input = wrapper.find('.js-input'),
								items = wrapper.find('.js-item'),
								link = wrapper.find('.js-link');

							// init
							if (!input.val()) {
								input.val( items.first().attr('data-id') );
							}
							if (wrapper.hasClass('js-forward-notify-dropdown')) {
								form.find('.js-action-forward-value').val(input.val() === 'forward' ? 1 : 0);
								form.find('.js-action-notify-value').val(input.val() === 'notify' ? 1 : 0);
							}
							link.text( items.filter('[data-id="'+ input.val() +'"]').first().text() );

							// toggle
							link.click(function() {
								// change input value to opposite
								var item = items.not('[data-id="'+ input.val() +'"]').first();
								input.val( item.attr('data-id') );
								link.text( item.text() );

								if (wrapper.hasClass('js-forward-notify-dropdown')) {
									form.find('.js-action-forward-value').val(input.val() === 'forward' ? 1 : 0);
									form.find('.js-action-notify-value').val(input.val() === 'notify' ? 1 : 0);
								}
							});
						});
				}

				function updateFieldNames(containers) {
					var num = 1;
					containers.each(function() {
						$(this).find('input, textarea').each(function() {
							var elem = $(this);
							elem.attr('name', elem.attr('data-base-name') + num);
						});
						num++;
					});
				}

				function updateConditionControls() {
					var conditionsCount = form.find('.js-condition-container:visible').length;
					form.find('.js-operator-container')[conditionsCount > 1 ? 'slideDown' : 'slideUp']();
					form.find('.js-no-conditions')[conditionsCount ? 'hide' : 'show']();
				}

				function isReplyWithMessage() {
					return form.find('.js-action-reply:checked').length && form.find('.js-replywith-message:checked').length;
				}

				function getFoldersList(currentId) {
					var result = [];

					ajs.each(folders, function (folder, id) {
						if (folder.canBeParent && !folder.subfolder && id !== currentId) {
							result.push(folder);
						}
					});

					return result;
				}
			}
		};


		// @export
		mailru.ui.SettingsFiltersEdit = ui;
	})();


	jsLoader.loaded('{mailru.ui}mailru.ui.SettingsFiltersEdit', 1);

// data/ru/images/js/ru/ui/mailru.ui.SettingsFiltersEdit.js end

// data/ru/images/js/ru/ui/mailru.ui.SettingsFiltersEditFwd.js start

/*global CheckForm*/


(function (){
		var ui = {
			wrap: function (view){
				var
					  form = $('#settings-form-edit-filter-fwd', view)
	//				, forwardEmailContainer = form.find('.js-forward-email-container')
				;

				$('.form__select', view).form__select();
				$('.js-action-forward-input', view).expandField({ rows: 5, parent: 'body' });

				// mail-10002 set focus
				$(':text,:checkbox,:radio, textarea', view).first().focus();

				form.submit(function() {
					var requiredFields = [],
						patternFields = [];

					requiredFields.push({
						name: 'Actions_forward_Param'
					});

					// User can't forward messages to his own address
					var validForwardEmails = [],
						forwardEmailField = form.find('.js-action-forward-input'),
						forwardEmails = forwardEmailField.val();
					if(forwardEmails) {
						forwardEmails = forwardEmails.split(/,\s*/);

						// mail-8535 p.1
						var mailParts = mailru.useremail.split("@");
						if (mailParts.length == 2 && mailParts[1] === "mail.ru")
							var mailUsername = mailParts[0];

						var regexp = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z0-9]{2,6}$/;

						for (var emailIdx = 0; emailIdx < forwardEmails.length; emailIdx++) {
							var email = forwardEmails[emailIdx].replace(/\s/g, '');
							if (email !== mailru.useremail && (!mailUsername || email !== mailUsername) && regexp.test(email) ) {
								validForwardEmails.push(email);
							}
						}
					}

					if (validForwardEmails.length) {
						forwardEmailField.val(validForwardEmails);
					}
					else {
						patternFields.push({
							name: 'Actions_forward_Param',
							error: Lang.get('options.filters.error.wrong_email')
						});
					}

					return CheckForm(form[0], requiredFields, patternFields, true);
				});

				mailru.ui.Options.init();
			}
		};

		// @export
		mailru.ui.SettingsFiltersEditFwd = ui;
	})();

	jsLoader.loaded('{mailru.ui}mailru.ui.SettingsFiltersEditFwd', 1);

// data/ru/images/js/ru/ui/mailru.ui.SettingsFiltersEditFwd.js end

// data/ru/images/js/ru/ui/mailru.ui.SettingsFolders.js start


(function (){
		var ui = {
			wrap: function (view, folders){
				var
					  form = $('#options-form-folders', view)
					, trashFolderId = mailru.Folder.TRASH
				;

				mailru.Folders.set(arMailRuFolders, 0, 1);

				form.delegate('.js-folder-container', 'hover', function(e) {
					var icon = $(e.currentTarget).find('.icon_folders');
					if (!icon.length) return;

					var classes = icon[0].className;
					if (e.type === 'mouseenter') {
						classes = classes.split(' ');
						for (var classIdx = 0; classIdx < classes.length; classIdx++) {
							var cls = classes[classIdx];
							if (cls !== 'icon' && cls !== 'icon_folders') {
								classes[classIdx] = cls.replace(/^(icon_\w+)$/, '$1_act');
							}
						}
						classes = classes.join(' ');
					}
					else {
						classes = classes.replace(/_act/g, '');
					}
					icon[0].className = classes;
				});

				form.delegate('.js-add', 'click', function(e) {
					LayerManager.show('settings__folders__edit', {
						foldersList: getFoldersList(),
						success: function(form) {
							// mail-9851 add parameter to reloaded page to show notification
							var s = document.location.search;
							var res = 'result=add';
							if (s.indexOf( res ) > -1)
								document.location.reload();
							else {
								document.location.href += ((s.substring(0,1) == "?") ? "&" : "?") + res;
							}
						}
					});
					return false;
				});

				form.delegate('.js-edit', 'click', function(e) {
					function accessFolder(status) {
						if (!status){
							return;
						}

						if (F.isSecure()) {
							$R('{mailru}' + 'mailru.Ajax', function() {
								mailru.Ajax({
									type: 'POST',
									url: 'ajax_settings?ajax_call=1&func_name=show_question',
									data: {
										folder: folder.id
									},
									complete: function(data) {
										var responseData = data.getData();
										if (responseData && responseData.Error) {
											alert(Lang.get('options.folders.error.server'));
										}
										else {
											/** @namespace responseData.Question */
											secretQuestion = responseData.Question;
											editFolder();
										}
									}
								})
							});
						}
						else {
							editFolder();
						}
					}

					function editFolder() {
						LayerManager.show('settings__folders__edit', {
							folderId: folder.id,
							parentId: oldParentId,
							folderName: ajs.Html.unescape(folder.name),
							foldersList: getFoldersList(folder.id),
							isPop: folder.pop,
							isParent: folder.parent,
							isSecret: folder.secret,
							canBeSubfolder: folder.canBeSubfolder,
							isPopEditable: folder.iseditable,
							secretQuestion: secretQuestion,
							success: function(form) {
								var parentId = parseInt(form.find('select[name="parentid"]').val(), 10),
									folderRow = $('#folder-row_' + folder.id),
									isSubfolder = !isNaN(parentId);
								if (!isSubfolder) {
									parentId = -1;
								}

								if (parentId !== oldParentId) {
									if (isSubfolder) {
										$('#folder-row_' + parentId).after(folderRow);
									}
									else {
										$('#folder-row_' + oldParentId).before(folderRow);
									}
								}

								folder.name = form.find('input[name="Name"]').val();
								folder.pop = !form.find('input[name="pop"]').attr('checked');
								folder.secret = form.find('input[name="secret"]').attr('checked');
								folder.parentId = parentId;
								folder.subfolder = isSubfolder;
								updateFolder(folder.id);

								if (parentId !== oldParentId) {
									updateFolder(oldParentId);
									updateFolder(parentId);
								}
								// mail-9851
								mailru.Notify.add('ok', { text: Lang.get('notify.folder.edit'), delay: 10 });
							},
							cancel: function(form) {
								updateFolder(folder.id);
							}
						});
					}

					var row = $(e.currentTarget).closest('.js-folder-container'),
						folderId = getFolderId(e),
						folder = folders[folderId],
						F = mailru.Folders.getSafe(folder.id),
						oldParentId = folder.parentId,
						secretQuestion;

					if (F && F.isSecureOpen())
						accessFolder(true);
					else
						mailru.Layers.secure(folder.id, accessFolder);

					return false;
				});

				form.delegate('.js-remove', 'click', function(e) {
					var folderId = getFolderId(e),
						folder = folders[folderId],
						trashFolder = folders[trashFolderId],
						row = $(e.currentTarget).closest('.js-folder-container');

					LayerManager.show('settings__folders__delete', {
						folderId: folderId,
						folderName: ajs.Html.unescape(folder.name),
						success: function() {
							trashFolder.size += folder.size;
							trashFolder.unread += folder.unread;
							trashFolder.messages += folder.messages;

							row.fadeOut('slow', function() {
								row.remove();
								delete folders[folderId];

								// mail-9425 update trash
								updateFolder(trashFolderId);
								if (folder.subfolder && folder.parentId != -1) {
									var parentFolder = folders[folder.parentId];
									updateFolder(parentFolder.id);
								}
							});

							// mail-9851
							mailru.Notify.add('ok', { text: Lang.get('notify.folder.delete'), delay: 10 });
						}
					});
					return false;
				});

				form.delegate('.js-clear', 'click', function(e) {
					var folderId = getFolderId(e),
						folder = folders[folderId],
						trashFolder = folders[trashFolderId],
						row = $(e.currentTarget).closest('.js-folder-container');

					LayerManager.show('settings__folders__clear', {
						folderId: folder.id,
						folderName: ajs.Html.unescape(folder.name),
						formSign: $('#form_sign').val(),
						formToken: $('#form_token').val(),
						success: function() {
							trashFolder.size += folder.size;
							trashFolder.unread += folder.unread;
							trashFolder.messages += folder.messages;
							folder.size = 0;
							folder.unread = 0;
							folder.messages = 0;

							row.find('.js-clear-container').fadeOut('slow', function() {
								updateFolder(folderId);
								updateFolder(trashFolderId);
							});

							// mail-9851
							mailru.Notify.add('ok', { text: Lang.get('notify.folder.clear'), delay: 10 });
						}
					});
					return false;
				});

				form.delegate('.js-secret', 'click', function(e) {
					function openFolder(status) {
						if (status){
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
                            location.href = url;
                        }
					}

					var folderId = getFolderId(e),
						F = mailru.Folders.getSafe(folderId);
					if (F && F.isSecureOpen())
						openFolder(true);
					else
						mailru.Layers.secure(folderId, openFolder);
					return false;
				});

				function getFolderId(e) {
					return $(e.currentTarget).closest('.js-folder-container').attr('data-id');
				}

				function updateFolder(id) {
					if (id === -1)
						return;

					var folder = folders[id];

					if (folder.secret) {
						var F = mailru.Folders.getSafe(id);
						folder.secretOpened = F.isSecureOpen();
						if (folder.secretOpened)
							folder.icon = 'secret-opened';
						else
							folder.icon = 'secret';
					}
					else {
						folder.icon = '';
					}

					folder.name = ajs.Html.unescape(folder.name)
					folder.name = ajs.Html.escape(folder.name);

					folder.parent = folderIsParent(id);

					/** @namespace folder.canBeDeletable */
					folder.deletable = folder.canBeDeletable && !folder.parent;

					// Cannot use $.fn.tpl here because oldIE don't support innerHTML on TRs
					$('#folder-row_' + id).html($.tpl('#folders__table-row_ejs', folder));
				}

				function getFoldersList(currentId) {
					var result = [];

					ajs.each(folders, function (folder, id) {
						if (folder.canBeParent && !folder.subfolder && id !== currentId) {
							folder.name = ajs.Html.unescape(folder.name);
							result.push(folder);
						}
					});

					return result;
				}

				function folderIsParent(id) {
					if (folders[id].subfolder) {
						return false;
					}

					var row = $('#folder-row_' + id),
						nextRow = row.next();

					if (nextRow.length) {
						var nextId = nextRow.attr('data-id'),
							nextFolder = folders[nextId];

						return nextFolder.subfolder;
					}

					return false;
				}

				// mail-9851 notifications
				if ( GET.result == 'add' ) {
					mailru.Notify.add('ok', { text: Lang.get('notify.folder.add'), delay: 10 });
				}
			}
		};

		// @export
		mailru.ui.SettingsFolders = ui;
	})();

	jsLoader.loaded('{mailru.ui}mailru.ui.SettingsFolders', 1);

// data/ru/images/js/ru/ui/mailru.ui.SettingsFolders.js end

// data/ru/images/js/ru/ui/mailru.ui.SettingsNotifications.js start


(function (){
		var ui = {
			wrap: function (view, phones, options){

				$('.form__select').form__select();
				$('.form__switcher__wrapper').form__switcher();

				// show/hide available operators
				var wrapper = $("#js-operators-wrapper"),
					showButton = wrapper.find(".js-show-operators"),
					operatorsList = wrapper.find(".js-operators");

				showButton.click(function() {
					operatorsList.display( operatorsList.css('display') == 'none' );
					$(window).triggerHandler('resize');
				});

				var form = $('#modifynotifyForm'),
					switcher = form.find('input[name="enabled"]'),
					smsOptionsContainer = $('#js-smsOptions-wrapper'),
					daytimeContainer = form.find('.js-daytime'),
					wholedayCheck = form.find('input[name="wholeday"]'),
					timezoneContainer = form.find('.js-timezone'),
					autoTimezoneCheck = form.find('input[name="AutoTimezone"]');

				wholedayCheck
						.click(function() {
					daytimeContainer.form__toggle( !wholedayCheck.attr('checked'));
				})
						.triggerHandler('click');

				autoTimezoneCheck
						.click(function() {
					timezoneContainer.form__toggle( !autoTimezoneCheck.attr('checked'));
				})
						.triggerHandler('click');

				switcher
					.change(function() {
						var on = switcher.first().attr('checked');
						smsOptionsContainer.form__toggle(on);
						if (on) {
							wholedayCheck.triggerHandler('click');
							autoTimezoneCheck.triggerHandler('click');
						}
					});
				switcher.triggerHandler('change');
				switcher.triggerHandler('click');

				form.submit(function() {
					smsOptionsContainer.find('[disabled]').removeAttr('disabled');
					return true;
				});

				// select with table inside
				(function() {
					// @todo Refactoring!
					function checkSmsDisabled(statusbar, phoneID) {
						var smsDisabled = statusbar.find('.js-sms-disabled'),
							switcherOn = $('#modifynotifyForm').find('input[name="enabled"]').first().attr('checked');


						if (smsDisabled) {
							if (switcherOn) {
								// mail-8851
								// change status text - add link to enable phone
								smsDisabled.html( Lang.get('options.notifications.status.sms_disabled') );
								$('.js-smsDisNotifyLink',statusbar).unbind('.smsDis').bind('click.smsDis', function() {
									mailru.API.get('phone/smsnotificationson', {phone : phoneID}, function(result) {
										if(result.isOk()){
											showSendStatusMessage(true, statusbar);
										}else{
											showSendStatusMessage(false, statusbar);
										}
									});
								});
							}
							else {
								smsDisabled.html(Lang.get('options.notifications.status.sms_disabled_short'));
							}
						}
					}

					function showSendStatusMessage(isOK, statusbar){
						statusbar.html(function() {
							return $('<span/>').addClass(isOK ? 'phones__status_ok' : 'phones__status_error')
								.text(isOK ? Lang.get('options.notifications.status.sms_send_text_ok') : Lang.get('options.notifications.status.sms_send_text_error'));
						});
					}

					var statusbar = $('.js-selected-item-status', '#phonesWrapper');

					$('.form__select').each(function() {
						function updateValues() {
							var item = list.find('.js-selected');
							if (!item.length) {
								item = list.find('.js-list-item').first();
							}
							var status = item.find('.js-list-item-status');

							field.val(item.attr('data-id'));
							text.text(item.attr('data-value'));
							statusbar.html(status.html());

							checkSmsDisabled(statusbar, item.attr('data-id'));
						}

						var container = $(this),
							list = container.find('.js-select-list'),
							text = container.find('.js-text'),
							field = $('input[name="main_phone"]', container);


						if (list.length) {
							container.dropdown({
								'link': '.js-select-link',
								'container':'.js-select-list',
								'onToggle': (function() {
									return function(isOpening, scope) {
										return !container.hasClass('form__select_disabled');
									}
								})(),
								'onClick': (function(){
									return function(evt, scope) {
										// get selected item
										var item = $(evt.target).closest('.js-list-item');
										// clear selected
										$('.js-list-item', list).removeClass('js-selected');
										// mark current as selected
										item.addClass('js-selected');
										// update field values and status
										updateValues();

										scope.hide();
										evt.preventDefault();
									}
								})()
							});

							updateValues();
						}
					});

					if (statusbar) {
						var mainPhone = $('input[name="main_phone"]').val();
						checkSmsDisabled(statusbar,mainPhone);

						$('#modifynotifyForm').find('input[name="enabled"]').change(function(){
							checkSmsDisabled(statusbar, mainPhone);
						});
					}
				})();

				// add phone
				// TODO:
				ajs.require('{mailru}'+'mailru.PhoneManager', function() {

					var phoneManager = new mailru.PhoneManager({
						'user': {
							'name': options.name,
							'domain': options.domain
						}
					});

					phoneManager.bind({
						'signupsmsCallback': function(evt, status) {
							if (!status)
								location.reload();
						},
						'verifySuccess addPhoneAlreadyExistsSuccess': function() {
							location.reload();
						}
					});

					$('#addNewPhone').click(function() {
						if ( !($('#addNewPhone').attr('disabled') == 'disabled') )
							phoneManager.addPhone();
						return false;
					});
				});

				var $container = $('#SMSContainer'),
						$innerContainer = $('#SMSContainerInner'),
						$folderInputs = $('input[name="folder"]', $innerContainer),
						$form = $('#modifynotifyForm'),
						$save = $('input[name="save"]', $form);

				$('#wholeday').change(function() {
					var $input = $(this);
					var disable = $input.is(':checked');
					$('#notify_from,#notify_to').attr('disabled', disable ? 'disabled' : '');
					$input.parents('tr:first').toggleClass('disabled', disable);
				}).change();

				$('#notify').change(function(evt) {
					var $input = $(this);
					var disable = !$input.is(':checked');
					$container.toggleClass('mr-fs_disable', disable);
					$(':input', $innerContainer).each(function() {
						var $input = $(this);
						if (disable) {
							$input.data('defaultDisable', $input.attr('disabled')).attr('disabled', 'disabled');
						}
						else {
							$input.attr('disabled', $input.data('defaultDisable'));
						}
					});
				}).change();

				$folderInputs.change(function(evt) {
					var disable = !$folderInputs.is(':checked');
					$save.attr('disabled', disable ? 'disabled' : '');
				}).first().change();

				var start = [], stop = [],
						$notifyFrom = $('#notify_from'), $notifyTo = $('#notify_to'),
						notifyFromOpt = $notifyFrom[0].options, notifyToOpt = $notifyTo[0].options;

				$.each(notifyFromOpt, function(key, option) {
					start.push(new Option(option.text, option.value));
				});

				$.each(notifyToOpt, function(key, option) {
					stop.push(new Option(option.text, option.value));
				});

				$notifyFrom.change(function() {
					var val = $notifyFrom.val(), prevVal = $notifyTo.val();
					notifyToOpt.length = 0;
					$.each(stop, function(key, option) {
						if (option.value != val)
							notifyToOpt[notifyToOpt.length] = option;
					});
					$notifyTo.val(prevVal);
				}).change();

				$notifyTo.change(function() {
					var val = $notifyTo.val(), prevVal = $notifyFrom.val();
					notifyFromOpt.length = 0;
					$.each(start, function(key, option) {
						if (option.value != val)
							notifyFromOpt[notifyFromOpt.length] = option;
					});
					$notifyFrom.val(prevVal);
				}).change();

				mailru.ui.Options.init();

				// mail-10002 set focus
				$(':text,:checkbox,:radio', form).first().focus();
			}
		};


		// @export
		mailru.ui.SettingsNotifications = ui;
	})();


	jsLoader.loaded('{mailru.ui}mailru.ui.SettingsNotifications', 1);

// data/ru/images/js/ru/ui/mailru.ui.SettingsNotifications.js end

// data/ru/images/js/ru/ui/mailru.ui.SettingsSecurity.js start


(function (){
		var ui = {
			wrap: function (view, options){
				view = $(view);

				$('.form__select', view).form__select();

				// mail-10002 set focus
				$(':text,:checkbox,:radio', view).first().focus();

				/** @namespace options.changePassword -- Immediately show change password popup*/
				if (options.changePassword) {
					changePassword();
				}


				//***** security *****

				function changePassword() {
					var phoneVerified;
					LayerManager.show('settings__security__password', { mrimDisabled: options.mrimDisabled
						, submit: submit, error: error });

					// MAIL-9560
					function submit(layer) {
						if (options.mrimDisabled && options.mrimDisabled != '0' && !phoneVerified) {
							layer.hide();
							// validate phone before post password
							var phoneManager = new mailru.PhoneManager({
								'user': {
									'name': options.user.name,
									'domain': options.user.domain,
									'isDisabled': true
								}
							});

							phoneManager.bind({
								'verifySuccess': function() {
									phoneVerified = true;
									// submit password
									layer.func(true);
								}
							});

							/** @namespace options.accountVerified */
							if (options.accountVerified && options.accountVerified != 0) {
								phoneManager.selectVerifySomePhone(options.phones);
							}
							else {
								phoneManager.addPhone();
							}

							return false;
						}
						else {
							// no mrim
							return true;
						}
					}

					function error(layer) {
						if (!layer.visible)
							layer.show();
					}

					return false;
				}

				var wrapper = $('#securityWrapper');

				view.delegate('.js-changePassword', 'click', function(e) {
					return changePassword();
				});

				view.delegate('.js-changeEmail', 'click', function(e) {
					LayerManager.show('settings__security__additionalEmail', {
						email:$('.js-email').text(),
						success:function(newEmail){
							var row = $('.js-emailRow', view),
								email = row.find('.js-email'),
								link = row.find('.js-changeEmail');

							if (newEmail && newEmail != '') {
								// has email
								email.text(newEmail);
								link.text(Lang.get('settings.security.additionalEmail')['nonempty'])
									.addClass('form__row__shift');
							} else {
								email.text('');
								link.text(Lang.get('settings.security.additionalEmail')['empty'])
									.removeClass('form__row__shift');
							}
							mailru.Notify.add('ok', { text: Lang.get('notify.save'), delay: 10 });
						}
					});
					return false;
				});

				// options for add password question pop-up
				/** @namespace options.secretAnswer */
				var passwordQuestionOptions = {
					question: $('#passwordQuestionOptions').html(),
					customQuestion: options.customQuestion,
					answer: options.secretAnswer,
					success:function(newQuestion){
						var row = $('.js-passwordQuestionRow', view),
							question = row.find('.js-passwordQuestion'),
							changeOk = row.find('.js-passwordQuestionOk'),
							link = row.find('.js-changePasswordQuestion');

						var textsObj = Lang.get('settings.security.passwordQuestion');

						if (newQuestion && newQuestion != '') {
							// non-empty question
							question.text(newQuestion+textsObj['nonempty']['text']);
							link.text(textsObj['nonempty']['link']);
							changeOk.display(true);
						}
						else {
							// empty question
							question.text(textsObj['empty']['text']);
							link.text(textsObj['empty']['link']);
							changeOk.display(false);
						}

						mailru.Notify.add('ok', { text: Lang.get('notify.save'), delay: 10 });

					}
				};

				view.delegate('.js-changePasswordQuestion', 'click', function(e) {
					LayerManager.show('settings__security__addPasswordQuestion', passwordQuestionOptions);
					return false;
				});


				// Phone manager
				/** @namespace options.verifyPhoneAskPassword */
				var phoneManager = new mailru.PhoneManager({
					AskPassword: options.verifyPhoneAskPassword,
					user: options.user
				});

				phoneManager.bind({
					'addPhoneSuccess': function(evt, result, data) {
						if (!data.ismobile) {
							document.location.href = document.location.pathname
								+ (document.location.search.match(/result=\w*\b/)
									? document.location.search.replace(/result=\w*\b/,'result=addphone')
									: ((document.location.search.substring(0,1) == "?") ? "&" : "?") + 'result=addphone' )
								+ document.location.hash;
						}
					},

					'verifySuccess addPhoneAlreadyExistsSuccess verifyPhoneCancel': function() {
						// mail-9851 add parameter to reloaded page to show notification
						document.location.href = document.location.pathname
							+ (document.location.search.match(/result=\w*\b/)
								? document.location.search.replace(/result=\w*\b/,'result=addphone')
								: ((document.location.search.substring(0,1) == "?") ? "&" : "?") + 'result=addphone' )
							+ document.location.hash;
					}
				});

				$('#addNewPhone').click(function() {
					if( !$('#addNewPhone').hasClass('disabled') ){
						phoneManager.addPhone();
					}
				});

				$('.js-phonesRow', '#phonesContainer').each(function(key) {
					var phone = options.phones[key];

					$('.js-verifyPhone', this).bind('click', {'phone': phone}, function(evt) {
						var phone = evt.data.phone;
						phoneManager.verifyPhone('', phone);
						evt.preventDefault();
					});
				});

				ajs.require(['{mailru}'+'mailru.core'], function (){
					// mail-9851 notifications
					var result = GET.result;
					if (result == 'ok' ) {
						mailru.Notify.add('ok', { text: Lang.get('notify.save'), delay: 10 });
					}
					else if (result == 'addphone' ) {
						mailru.Notify.add('ok', { text: Lang.get('notify.phone.add'), delay: 10 });
					}
					else if (result == 'password' ) {
						mailru.Notify.add('ok', { text: Lang.get('notify.password.change'), delay: 10 });
					}
				});

				ajs.require(['{jQuery}'+'jquery.mrcalendar'], function (){
					view.find('.js-date-from-calendar').mrcalendar({
						toggle: '.js-date-from',
						linkoff: true,
						onclick: function(data) {
							view.find('.js-date-from').val(data[2] + '.' + data[1] + '.' + data[0]);
						}
					});

					view.find('.js-date-to-calendar').mrcalendar({
						toggle: '.js-date-to',
						linkoff: true,
						onclick: function(data) {
							view.find('.js-date-to').val(data[2] + '.' + data[1] + '.' + data[0]);
						}
					});

					view.find('.js-calendar-link').click(function() {
						$(this).siblings('input').focus();
						return false;
					});
				});

				//***** form *****
				var   $form = $('#formSecurity',view)
					, $accaCheckbox = $form.find('input[name="Acca-checkbox"]')
					;

				var hasAccaCheckbox = !!$accaCheckbox.length;
				if (hasAccaCheckbox)
				{
					var accaCheckboxInitValue = $accaCheckbox.is(":checked");

					// MAIL-14109
					$form.submit(function(form, force) {
						if(force === true) {
							return true;
						}

						var accaCheckboxValue = $accaCheckbox.is(":checked");
						if(accaCheckboxValue != accaCheckboxInitValue) {
							// checkbox changed, so before submitting form
							// show popup to enter password and captcha
							LayerManager.show('settings__security__acca', {
								isOn: accaCheckboxValue,
								error: ajs.HTML.unescape(options.acc_onoff_fail),
								success: function(layer){
									// add hidden fields to the form and submit it
									var   password = layer.$div.find('input[name="pswd"]').val()
										, captcha = layer.$div.find('input[name="security_image_answer"]').val();

									$form.append([
										  createField('Acca', accaCheckboxValue? 1 : 0)
										, createField('password', password)
										, createField('security_image_answer', captcha)
									].join(''));

									$form.trigger('submit',true);
								}
							});
							return false;
						}
						else {
							// checkbox value is not changed, submit form
							return true;
						}

						function createField(name, value) {
							return '<input type="hidden" name="'+name+'" value="'+value+'">';
						}
					});

					// handle error
					if (options.acc_onoff_fail) {
						// в случае ошибки, нужно сразу показать попап и засабмитить форму.
						$accaCheckbox.click();
						$form.trigger('submit');
					}
				}

				mailru.ui.Options.init();

				// ************** mail-9789 user logs (acca_list) ************

				function getDateString(str)
				{
					if(!str)
						return str;
					var date = str.split('-');
					if (date.length != 3)
						return str;

					var currentDay = new Date().getDate();
					if(currentDay == removeZero(date[2])) {
						str = Lang.get('settings.security.accalist.today');
					} else if ((--currentDay).toString() == removeZero(date[2])) {
						str = Lang.get('settings.security.accalist.yesterday');
					}
					else {
						str = createDateString(date);
					}

					return str;
				}

				function getUseragent(str, detectOS)
				{
					if(!str)
						return '';

					var browser = ''
						, os = ''
						, version;
					// detect mail ru apps
					if (~str.indexOf('MRMail')) {
						browser = Lang.get('settings.security.accalist.useragent.mrmail.iphone');
					} else if (~str.indexOf('mobmail')) {
						if (~str.indexOf('android')) {
							browser = Lang.get('settings.security.accalist.useragent.mrmail.android');
						} else if (~str.indexOf('win8')) {
							browser = Lang.get('settings.security.accalist.useragent.mrmail.win8');
						} else if (~str.indexOf('qt')) {
							browser = Lang.get('settings.security.accalist.useragent.mrmail.symbian');
						}

					// detect firefox
					} else if(~str.indexOf('Firefox')) {
						browser = Lang.get('settings.security.accalist.useragent.browser.firefox');
					// detect webkit family, the order of checks is important here
					} else if (~str.indexOf('MRCHROME')) {
						browser = Lang.get('settings.security.accalist.useragent.browser.amigo');
					} else if (~str.indexOf('Chromium')) {
						browser = Lang.get('settings.security.accalist.useragent.browser.chromium');
					} else if (~str.indexOf('Chrome')) {
						browser = Lang.get('settings.security.accalist.useragent.browser.chrome');
					} else if (~str.indexOf('Safari')) {
						browser = Lang.get('settings.security.accalist.useragent.browser.safari');
					// detect the other guys
					} else if (~str.indexOf('Opera')) {
						browser = Lang.get('settings.security.accalist.useragent.browser.opera');
					} else if (~str.indexOf('MSIE')) {
						browser = Lang.get('settings.security.accalist.useragent.browser.ie');
					}

					if(detectOS) {
						// detect OS
						if (~str.indexOf('Windows')) {
							// windows family
							if(~str.indexOf('Windows NT 6.1')) {
								os = "Windows 7";
							} else if (~str.indexOf('Windows NT 5.1')) {
								os = "Windows XP";
							} else if (~str.indexOf('Windows NT 6.2')) {
								os = "Windows 8";
							} else if (~str.indexOf('Windows NT 6.0')) {
								os = "Windows Vista";
							} else {
								os = "Windows";
							}
						} else if (~str.indexOf('iPhone') || ~str.indexOf('iPad')) {
							os = 'iOS';
						} else if (~str.indexOf('Mac OS X')) {
							os = 'Mac OS X';
						} else if (~str.indexOf('MacOS')) {
							os = 'Mac OS';
						} else if (~str.indexOf('Android')) {
							os = 'Android';
						} else if (~str.indexOf('Linux')) {
							os = 'Linux';
						}

						if (browser && os) {
							os = ' ('+os+')';
						}
					}

					return (browser + os) || str;
				}

				function createDateString(data)
				{
					var dateStr;
					if (mailru.LANG == 'en_US') {
						dateStr = Lang.get('Date').months[1][parseInt(data[1], 10)-1] + ' ' + removeZero(data[2]) + ',' + data[0];
					} else {
						dateStr = removeZero(data[2]) + ' ' + Lang.get('Date').months[1][parseInt(data[1], 10)-1] + ' ' + data[0];
					}
					return dateStr;
				}

				function removeZero (str) {
					return Number(str);
				}

				var $accaListWrapper = $('.js-acca-list-wrapper', view);
				var $date = $('.js-date', $accaListWrapper),
					$useragent = $('.js-useragent', $accaListWrapper),
					$action = $('.js-action', $accaListWrapper),
					$folder = $('.js-folder-move', $accaListWrapper);

				mailru.Folders.set(arMailRuFolders, 0, 1);

				// format date
				$date.each(function(k, item) {
					var $item = $(item);
					$item.text( getDateString( $item.text() ) );
				}.bind(this));

				// cut useragent up to browser name
				$useragent.each(function(k, item) {
					var $item = $(item);
					var device = $item.data('device') || '';
					var ua = getUseragent( $item.data('ua'), (device == '') ); // for mobile devices do not detect OS
					var result;
					if (device != '') {
						// "device (browser)" or "device" when browser is ua is unknown
						result = device;
						if (ua != $item.data('ua'))
							result += ' (' + ua + ')';
					} else {
						// "browser (os)" or "useragent" when ua is unknown
						result = ua;
					}
					$item.text( result );
				}.bind(this));

				// get folder names
				$folder.each(function(k, item) {
					var $item = $(item);
					var itemText = $item.text();
					var folderName = itemText != "" ? mailru.Folders.getSafe(itemText).Name : "";
					if (folderName != "") {
						$item.text(folderName);
					} else {
						$item.closest('.js-row')
							.hide();
					}
				}.bind(this));

				// hide unknown actions
				$('.js-unknown-action', $accaListWrapper).each(function(k, item) {
					// search for row and hide it
					$(item)
						.closest('.js-row')
						.hide();
				});

				$action.each(function(k, item) {
					var $item = $(item);
					$item.attr( 'title', $item.text().trim() );
				}.bind(this));

				// we are ready, show
				$accaListWrapper.fadeIn();
			}
		};

		// @export
		mailru.ui.SettingsSecurity = ui;
	})();


	jsLoader.loaded('{mailru.ui}mailru.ui.SettingsSecurity', 1);

// data/ru/images/js/ru/ui/mailru.ui.SettingsSecurity.js end

// 5
	jsLoader.loaded('{mailru.build}Settings', 0);

})(jQuery, jQuery);

// data/ru/images/js/ru/build/Settings.js end
