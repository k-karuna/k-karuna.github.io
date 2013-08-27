jsLoader.require([
    '{utils}Counter'
], function() {

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
				, 't1089': 1807124  // MAIL-17893
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
				, 't1089': 1807125  // MAIL-17893
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

			SIGNUP_PAGE: {
				external: {
					submit:  1740552,
					show:    1740552,
					captcha: 1740557
				}
			},

			// MAIL-5249
			ATTACH_ARCHIVE: {
				  'rar': 655847
				, 'zip': 655849
				, '7z':  655850
				, 'arj': 655851
				, 'tar': 655852
				, 'jar': 655853
				, 'bz2': 655854
				, 'gz':  655856
				, 'lzh': 655857
				, 'cab': 655858
			},

			COLLECTOR: {
				EXTERNAL_ACCOUNT: 1715266 // MAIL-16865
			}
		};

		$(window).bind({
			'collector.external_account': function() {
				Counter.d(COUNTERS.COLLECTOR.EXTERNAL_ACCOUNT);
			}
		});

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

					//MAIL-15811
					if(mailru.IsPddAccount){
						Counter.d("1712131");
					}
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

					//MAIL-15811
					if(mailru.IsPddAccount){
						Counter.d("1712134");
					}
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

		$(window).bind({
			'showExternal.signup': function () {
				Counter.d(COUNTERS.SIGNUP_PAGE.external.show);
			},
			'submitExternal.signup': function () {
				Counter.sb(COUNTERS.SIGNUP_PAGE.external.submit);
			},
			'captchaExternal.signup': function () {
				Counter.sb(COUNTERS.SIGNUP_PAGE.external.captcha);
			}
		});

	})(jQuery);

	jsLoader.loaded('{mailru}mailru.BindedCounters');
});

