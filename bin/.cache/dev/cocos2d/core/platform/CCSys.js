
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCSys.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var settingPlatform;

if (!CC_EDITOR) {
  settingPlatform = window._CCSettings ? _CCSettings.platform : undefined;
}

var isVivoGame = settingPlatform === 'qgame';
var isOppoGame = settingPlatform === 'quickgame';
var isHuaweiGame = settingPlatform === 'huawei';
var isJKWGame = settingPlatform === 'jkw-game';
var isQttGame = settingPlatform === 'qtt-game';

var _global = typeof window === 'undefined' ? global : window;

function initSys() {
  /**
   * System variables
   * @class sys
   * @main
   * @static
   */
  cc.sys = {};
  var sys = cc.sys;
  /**
   * English language code
   * @property {String} LANGUAGE_ENGLISH
   * @readOnly
   */

  sys.LANGUAGE_ENGLISH = "en";
  /**
   * Chinese language code
   * @property {String} LANGUAGE_CHINESE
   * @readOnly
   */

  sys.LANGUAGE_CHINESE = "zh";
  /**
   * French language code
   * @property {String} LANGUAGE_FRENCH
   * @readOnly
   */

  sys.LANGUAGE_FRENCH = "fr";
  /**
   * Italian language code
   * @property {String} LANGUAGE_ITALIAN
   * @readOnly
   */

  sys.LANGUAGE_ITALIAN = "it";
  /**
   * German language code
   * @property {String} LANGUAGE_GERMAN
   * @readOnly
   */

  sys.LANGUAGE_GERMAN = "de";
  /**
   * Spanish language code
   * @property {String} LANGUAGE_SPANISH
   * @readOnly
   */

  sys.LANGUAGE_SPANISH = "es";
  /**
   * Spanish language code
   * @property {String} LANGUAGE_DUTCH
   * @readOnly
   */

  sys.LANGUAGE_DUTCH = "du";
  /**
   * Russian language code
   * @property {String} LANGUAGE_RUSSIAN
   * @readOnly
   */

  sys.LANGUAGE_RUSSIAN = "ru";
  /**
   * Korean language code
   * @property {String} LANGUAGE_KOREAN
   * @readOnly
   */

  sys.LANGUAGE_KOREAN = "ko";
  /**
   * Japanese language code
   * @property {String} LANGUAGE_JAPANESE
   * @readOnly
   */

  sys.LANGUAGE_JAPANESE = "ja";
  /**
   * Hungarian language code
   * @property {String} LANGUAGE_HUNGARIAN
   * @readonly
   */

  sys.LANGUAGE_HUNGARIAN = "hu";
  /**
   * Portuguese language code
   * @property {String} LANGUAGE_PORTUGUESE
   * @readOnly
   */

  sys.LANGUAGE_PORTUGUESE = "pt";
  /**
   * Arabic language code
   * @property {String} LANGUAGE_ARABIC
   * @readOnly
   */

  sys.LANGUAGE_ARABIC = "ar";
  /**
   * Norwegian language code
   * @property {String} LANGUAGE_NORWEGIAN
   * @readOnly
   */

  sys.LANGUAGE_NORWEGIAN = "no";
  /**
   * Polish language code
   * @property {String} LANGUAGE_POLISH
   * @readOnly
   */

  sys.LANGUAGE_POLISH = "pl";
  /**
   * Turkish language code
   * @property {String} LANGUAGE_TURKISH
   * @readOnly
   */

  sys.LANGUAGE_TURKISH = "tr";
  /**
   * Ukrainian language code
   * @property {String} LANGUAGE_UKRAINIAN
   * @readOnly
   */

  sys.LANGUAGE_UKRAINIAN = "uk";
  /**
   * Romanian language code
   * @property {String} LANGUAGE_ROMANIAN
   * @readOnly
   */

  sys.LANGUAGE_ROMANIAN = "ro";
  /**
   * Bulgarian language code
   * @property {String} LANGUAGE_BULGARIAN
   * @readOnly
   */

  sys.LANGUAGE_BULGARIAN = "bg";
  /**
   * Unknown language code
   * @property {String} LANGUAGE_UNKNOWN
   * @readOnly
   */

  sys.LANGUAGE_UNKNOWN = "unknown";
  /**
   * @property {String} OS_IOS
   * @readOnly
   */

  sys.OS_IOS = "iOS";
  /**
   * @property {String} OS_ANDROID
   * @readOnly
   */

  sys.OS_ANDROID = "Android";
  /**
   * @property {String} OS_WINDOWS
   * @readOnly
   */

  sys.OS_WINDOWS = "Windows";
  /**
   * @property {String} OS_MARMALADE
   * @readOnly
   */

  sys.OS_MARMALADE = "Marmalade";
  /**
   * @property {String} OS_LINUX
   * @readOnly
   */

  sys.OS_LINUX = "Linux";
  /**
   * @property {String} OS_BADA
   * @readOnly
   */

  sys.OS_BADA = "Bada";
  /**
   * @property {String} OS_BLACKBERRY
   * @readOnly
   */

  sys.OS_BLACKBERRY = "Blackberry";
  /**
   * @property {String} OS_OSX
   * @readOnly
   */

  sys.OS_OSX = "OS X";
  /**
   * @property {String} OS_WP8
   * @readOnly
   */

  sys.OS_WP8 = "WP8";
  /**
   * @property {String} OS_WINRT
   * @readOnly
   */

  sys.OS_WINRT = "WINRT";
  /**
   * @property {String} OS_UNKNOWN
   * @readOnly
   */

  sys.OS_UNKNOWN = "Unknown";
  /**
   * @property {Number} UNKNOWN
   * @readOnly
   * @default -1
   */

  sys.UNKNOWN = -1;
  /**
   * @property {Number} WIN32
   * @readOnly
   * @default 0
   */

  sys.WIN32 = 0;
  /**
   * @property {Number} LINUX
   * @readOnly
   * @default 1
   */

  sys.LINUX = 1;
  /**
   * @property {Number} MACOS
   * @readOnly
   * @default 2
   */

  sys.MACOS = 2;
  /**
   * @property {Number} ANDROID
   * @readOnly
   * @default 3
   */

  sys.ANDROID = 3;
  /**
   * @property {Number} IPHONE
   * @readOnly
   * @default 4
   */

  sys.IPHONE = 4;
  /**
   * @property {Number} IPAD
   * @readOnly
   * @default 5
   */

  sys.IPAD = 5;
  /**
   * @property {Number} BLACKBERRY
   * @readOnly
   * @default 6
   */

  sys.BLACKBERRY = 6;
  /**
   * @property {Number} NACL
   * @readOnly
   * @default 7
   */

  sys.NACL = 7;
  /**
   * @property {Number} EMSCRIPTEN
   * @readOnly
   * @default 8
   */

  sys.EMSCRIPTEN = 8;
  /**
   * @property {Number} TIZEN
   * @readOnly
   * @default 9
   */

  sys.TIZEN = 9;
  /**
   * @property {Number} WINRT
   * @readOnly
   * @default 10
   */

  sys.WINRT = 10;
  /**
   * @property {Number} WP8
   * @readOnly
   * @default 11
   */

  sys.WP8 = 11;
  /**
   * @property {Number} MOBILE_BROWSER
   * @readOnly
   * @default 100
   */

  sys.MOBILE_BROWSER = 100;
  /**
   * @property {Number} DESKTOP_BROWSER
   * @readOnly
   * @default 101
   */

  sys.DESKTOP_BROWSER = 101;
  /**
   * Indicates whether executes in editor's window process (Electron's renderer context)
   * @property {Number} EDITOR_PAGE
   * @readOnly
   * @default 102
   */

  sys.EDITOR_PAGE = 102;
  /**
   * Indicates whether executes in editor's main process (Electron's browser context)
   * @property {Number} EDITOR_CORE
   * @readOnly
   * @default 103
   */

  sys.EDITOR_CORE = 103;
  /**
   * @property {Number} WECHAT_GAME
   * @readOnly
   * @default 104
   */

  sys.WECHAT_GAME = 104;
  /**
   * @property {Number} QQ_PLAY
   * @readOnly
   * @default 105
   */

  sys.QQ_PLAY = 105;
  /**
   * @property {Number} FB_PLAYABLE_ADS
   * @readOnly
   * @default 106
   */

  sys.FB_PLAYABLE_ADS = 106;
  /**
   * @property {Number} BAIDU_GAME
   * @readOnly
   * @default 107
   */

  sys.BAIDU_GAME = 107;
  /**
   * @property {Number} VIVO_GAME
   * @readOnly
   * @default 108
   */

  sys.VIVO_GAME = 108;
  /**
   * @property {Number} OPPO_GAME
   * @readOnly
   * @default 109
   */

  sys.OPPO_GAME = 109;
  /**
   * @property {Number} HUAWEI_GAME
   * @readOnly
   * @default 110
   */

  sys.HUAWEI_GAME = 110;
  /**
   * @property {Number} XIAOMI_GAME
   * @readOnly
   * @default 111
   */

  sys.XIAOMI_GAME = 111;
  /**
   * @property {Number} JKW_GAME
   * @readOnly
   * @default 112
   */

  sys.JKW_GAME = 112;
  /**
   * @property {Number} ALIPAY_GAME
   * @readOnly
   * @default 113
   */

  sys.ALIPAY_GAME = 113;
  /**
   * @property {Number} WECHAT_GAME_SUB
   * @readOnly
   * @default 114
   */

  sys.WECHAT_GAME_SUB = 114;
  /**
   * @property {Number} BAIDU_GAME_SUB
   * @readOnly
   * @default 115
   */

  sys.BAIDU_GAME_SUB = 115;
  /**
   * @property {Number} QTT_GAME
   * @readOnly
   * @default 116
   */

  sys.QTT_GAME = 116;
  /**
   * BROWSER_TYPE_WECHAT
   * @property {String} BROWSER_TYPE_WECHAT
   * @readOnly
   * @default "wechat"
   */

  sys.BROWSER_TYPE_WECHAT = "wechat";
  /**
   * BROWSER_TYPE_WECHAT_GAME
   * @property {String} BROWSER_TYPE_WECHAT_GAME
   * @readOnly
   * @default "wechatgame"
   */

  sys.BROWSER_TYPE_WECHAT_GAME = "wechatgame";
  /**
   * BROWSER_TYPE_WECHAT_GAME_SUB
   * @property {String} BROWSER_TYPE_WECHAT_GAME_SUB
   * @readOnly
   * @default "wechatgamesub"
   */

  sys.BROWSER_TYPE_WECHAT_GAME_SUB = "wechatgamesub";
  /**
   * BROWSER_TYPE_BAIDU_GAME
   * @property {String} BROWSER_TYPE_BAIDU_GAME
   * @readOnly
   * @default "baidugame"
   */

  sys.BROWSER_TYPE_BAIDU_GAME = "baidugame";
  /**
   * BROWSER_TYPE_BAIDU_GAME_SUB
   * @property {String} BROWSER_TYPE_BAIDU_GAME_SUB
   * @readOnly
   * @default "baidugamesub"
   */

  sys.BROWSER_TYPE_BAIDU_GAME_SUB = "baidugamesub";
  /**
   * BROWSER_TYPE_XIAOMI_GAME
   * @property {String} BROWSER_TYPE_XIAOMI_GAME
   * @readOnly
   * @default "xiaomigame"
   */

  sys.BROWSER_TYPE_XIAOMI_GAME = "xiaomigame";
  /**
   * BROWSER_TYPE_ALIPAY_GAME
   * @property {String} BROWSER_TYPE_ALIPAY_GAME
   * @readOnly
   * @default "alipaygame"
   */

  sys.BROWSER_TYPE_ALIPAY_GAME = "alipaygame";
  /**
   * BROWSER_TYPE_QQ_PLAY
   * @property {String} BROWSER_TYPE_QQ_PLAY
   * @readOnly
   * @default "qqplay"
   */

  sys.BROWSER_TYPE_QQ_PLAY = "qqplay";
  /**
   *
   * @property {String} BROWSER_TYPE_ANDROID
   * @readOnly
   * @default "androidbrowser"
   */

  sys.BROWSER_TYPE_ANDROID = "androidbrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_IE
   * @readOnly
   * @default "ie"
   */

  sys.BROWSER_TYPE_IE = "ie";
  /**
   *
   * @property {String} BROWSER_TYPE_EDGE
   * @readOnly
   * @default "edge"
   */

  sys.BROWSER_TYPE_EDGE = "edge";
  /**
   *
   * @property {String} BROWSER_TYPE_QQ
   * @readOnly
   * @default "qqbrowser"
   */

  sys.BROWSER_TYPE_QQ = "qqbrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_MOBILE_QQ
   * @readOnly
   * @default "mqqbrowser"
   */

  sys.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_UC
   * @readOnly
   * @default "ucbrowser"
   */

  sys.BROWSER_TYPE_UC = "ucbrowser";
  /**
   * uc third party integration.
   * @property {String} BROWSER_TYPE_UCBS
   * @readOnly
   * @default "ucbs"
   */

  sys.BROWSER_TYPE_UCBS = "ucbs";
  /**
   *
   * @property {String} BROWSER_TYPE_360
   * @readOnly
   * @default "360browser"
   */

  sys.BROWSER_TYPE_360 = "360browser";
  /**
   *
   * @property {String} BROWSER_TYPE_BAIDU_APP
   * @readOnly
   * @default "baiduboxapp"
   */

  sys.BROWSER_TYPE_BAIDU_APP = "baiduboxapp";
  /**
   *
   * @property {String} BROWSER_TYPE_BAIDU
   * @readOnly
   * @default "baidubrowser"
   */

  sys.BROWSER_TYPE_BAIDU = "baidubrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_MAXTHON
   * @readOnly
   * @default "maxthon"
   */

  sys.BROWSER_TYPE_MAXTHON = "maxthon";
  /**
   *
   * @property {String} BROWSER_TYPE_OPERA
   * @readOnly
   * @default "opera"
   */

  sys.BROWSER_TYPE_OPERA = "opera";
  /**
   *
   * @property {String} BROWSER_TYPE_OUPENG
   * @readOnly
   * @default "oupeng"
   */

  sys.BROWSER_TYPE_OUPENG = "oupeng";
  /**
   *
   * @property {String} BROWSER_TYPE_MIUI
   * @readOnly
   * @default "miuibrowser"
   */

  sys.BROWSER_TYPE_MIUI = "miuibrowser";
  /**
   *
   * @property {String} BROWSER_TYPE_FIREFOX
   * @readOnly
   * @default "firefox"
   */

  sys.BROWSER_TYPE_FIREFOX = "firefox";
  /**
   *
   * @property {String} BROWSER_TYPE_SAFARI
   * @readOnly
   * @default "safari"
   */

  sys.BROWSER_TYPE_SAFARI = "safari";
  /**
   *
   * @property {String} BROWSER_TYPE_CHROME
   * @readOnly
   * @default "chrome"
   */

  sys.BROWSER_TYPE_CHROME = "chrome";
  /**
   *
   * @property {String} BROWSER_TYPE_LIEBAO
   * @readOnly
   * @default "liebao"
   */

  sys.BROWSER_TYPE_LIEBAO = "liebao";
  /**
   *
   * @property {String} BROWSER_TYPE_QZONE
   * @readOnly
   * @default "qzone"
   */

  sys.BROWSER_TYPE_QZONE = "qzone";
  /**
   *
   * @property {String} BROWSER_TYPE_SOUGOU
   * @readOnly
   * @default "sogou"
   */

  sys.BROWSER_TYPE_SOUGOU = "sogou";
  /**
   *
   * @property {String} BROWSER_TYPE_UNKNOWN
   * @readOnly
   * @default "unknown"
   */

  sys.BROWSER_TYPE_UNKNOWN = "unknown";
  /**
   * Is native ? This is set to be true in jsb auto.
   * @property {Boolean} isNative
   */

  sys.isNative = CC_JSB || CC_RUNTIME;
  /**
   * Is web browser ?
   * @property {Boolean} isBrowser
   */

  sys.isBrowser = typeof window === 'object' && typeof document === 'object' && !CC_JSB && !CC_RUNTIME;
  /**
   * Is webgl extension support?
   * @method glExtension
   * @param name
   */

  sys.glExtension = function (name) {
    return !!cc.renderer.device.ext(name);
  };
  /**
   * Get max joint matrix size for skinned mesh renderer.
   * @method getMaxJointMatrixSize
   */


  sys.getMaxJointMatrixSize = function () {
    if (!sys._maxJointMatrixSize) {
      var JOINT_MATRICES_SIZE = 50;
      var LEFT_UNIFORM_SIZE = 10;
      var gl = cc.game._renderContext;
      var maxUniforms = Math.floor(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) / 4) - LEFT_UNIFORM_SIZE;

      if (maxUniforms < JOINT_MATRICES_SIZE) {
        sys._maxJointMatrixSize = 0;
      } else {
        sys._maxJointMatrixSize = JOINT_MATRICES_SIZE;
      }
    }

    return sys._maxJointMatrixSize;
  };

  if (_global.__globalAdapter && _global.__globalAdapter.adaptSys) {
    // init sys info in adapter
    _global.__globalAdapter.adaptSys(sys);
  } else if (CC_EDITOR && Editor.isMainProcess) {
    sys.isMobile = false;
    sys.platform = sys.EDITOR_CORE;
    sys.language = sys.LANGUAGE_UNKNOWN;
    sys.languageCode = undefined;
    sys.os = {
      darwin: sys.OS_OSX,
      win32: sys.OS_WINDOWS,
      linux: sys.OS_LINUX
    }[process.platform] || sys.OS_UNKNOWN;
    sys.browserType = null;
    sys.browserVersion = null;
    sys.windowPixelResolution = {
      width: 0,
      height: 0
    };
    sys.__audioSupport = {};
  } else if (CC_JSB || CC_RUNTIME) {
    var platform;

    if (isVivoGame) {
      platform = sys.VIVO_GAME;
    } else if (isOppoGame) {
      platform = sys.OPPO_GAME;
    } else if (isHuaweiGame) {
      platform = sys.HUAWEI_GAME;
    } else if (isJKWGame) {
      platform = sys.JKW_GAME;
    } else if (isQttGame) {
      platform = sys.QTT_GAME;
    } else {
      platform = __getPlatform();
    }

    sys.platform = platform;
    sys.isMobile = platform === sys.ANDROID || platform === sys.IPAD || platform === sys.IPHONE || platform === sys.WP8 || platform === sys.TIZEN || platform === sys.BLACKBERRY || platform === sys.XIAOMI_GAME || isVivoGame || isOppoGame || isHuaweiGame || isJKWGame || isQttGame;
    sys.os = __getOS();
    sys.language = __getCurrentLanguage();
    var languageCode;

    if (CC_JSB) {
      languageCode = __getCurrentLanguageCode();
    }

    sys.languageCode = languageCode ? languageCode.toLowerCase() : undefined;
    sys.osVersion = __getOSVersion();
    sys.osMainVersion = parseInt(sys.osVersion);
    sys.browserType = null;
    sys.browserVersion = null;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var ratio = window.devicePixelRatio || 1;
    sys.windowPixelResolution = {
      width: ratio * w,
      height: ratio * h
    };
    sys.localStorage = window.localStorage;
    var capabilities;
    capabilities = sys.capabilities = {
      "canvas": false,
      "opengl": true,
      "webp": true
    };

    if (sys.isMobile) {
      capabilities["accelerometer"] = true;
      capabilities["touches"] = true;
    } else {
      // desktop
      capabilities["keyboard"] = true;
      capabilities["mouse"] = true;
      capabilities["touches"] = false;
    }

    sys.__audioSupport = {
      ONLY_ONE: false,
      WEB_AUDIO: false,
      DELAY_CREATE_CTX: false,
      format: ['.mp3']
    };
  } else {
    // browser or runtime
    var win = window,
        nav = win.navigator,
        doc = document,
        docEle = doc.documentElement;
    var ua = nav.userAgent.toLowerCase();

    if (CC_EDITOR) {
      sys.isMobile = false;
      sys.platform = sys.EDITOR_PAGE;
    } else {
      /**
       * Indicate whether system is mobile system
       * @property {Boolean} isMobile
       */
      sys.isMobile = /mobile|android|iphone|ipad/.test(ua);
      /**
       * Indicate the running platform
       * @property {Number} platform
       */

      if (typeof FbPlayableAd !== "undefined") {
        sys.platform = sys.FB_PLAYABLE_ADS;
      } else {
        sys.platform = sys.isMobile ? sys.MOBILE_BROWSER : sys.DESKTOP_BROWSER;
      }
    }

    var currLanguage = nav.language;
    currLanguage = currLanguage ? currLanguage : nav.browserLanguage;
    /**
     * Get current language iso 639-1 code.
     * Examples of valid language codes include "zh-tw", "en", "en-us", "fr", "fr-fr", "es-es", etc.
     * The actual value totally depends on results provided by destination platform.
     * @property {String} languageCode
     */

    sys.languageCode = currLanguage.toLowerCase();
    currLanguage = currLanguage ? currLanguage.split("-")[0] : sys.LANGUAGE_ENGLISH;
    /**
     * Indicate the current language of the running system
     * @property {String} language
     */

    sys.language = currLanguage; // Get the os of system

    var isAndroid = false,
        iOS = false,
        osVersion = '',
        osMainVersion = 0;
    var uaResult = /android (\d+(?:\.\d+)*)/i.exec(ua) || /android (\d+(?:\.\d+)*)/i.exec(nav.platform);

    if (uaResult) {
      isAndroid = true;
      osVersion = uaResult[1] || '';
      osMainVersion = parseInt(osVersion) || 0;
    }

    uaResult = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(ua);

    if (uaResult) {
      iOS = true;
      osVersion = uaResult[2] || '';
      osMainVersion = parseInt(osVersion) || 0;
    } // refer to https://github.com/cocos-creator/engine/pull/5542 , thanks for contribition from @krapnikkk
    // ipad OS 13 safari identifies itself as "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko)" 
    // so use maxTouchPoints to check whether it's desktop safari or not. 
    // reference: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    // FIXME: should remove it when touch-enabled macs are available
    else if (/(iPhone|iPad|iPod)/.exec(nav.platform) || nav.platform === 'MacIntel' && nav.maxTouchPoints && nav.maxTouchPoints > 1) {
        iOS = true;
        osVersion = '';
        osMainVersion = 0;
      }

    var osName = sys.OS_UNKNOWN;
    if (nav.appVersion.indexOf("Win") !== -1) osName = sys.OS_WINDOWS;else if (iOS) osName = sys.OS_IOS;else if (nav.appVersion.indexOf("Mac") !== -1) osName = sys.OS_OSX;else if (nav.appVersion.indexOf("X11") !== -1 && nav.appVersion.indexOf("Linux") === -1) osName = sys.OS_UNIX;else if (isAndroid) osName = sys.OS_ANDROID;else if (nav.appVersion.indexOf("Linux") !== -1 || ua.indexOf("ubuntu") !== -1) osName = sys.OS_LINUX;
    /**
     * Indicate the running os name
     * @property {String} os
     */

    sys.os = osName;
    /**
     * Indicate the running os version
     * @property {String} osVersion
     */

    sys.osVersion = osVersion;
    /**
     * Indicate the running os main version
     * @property {Number} osMainVersion
     */

    sys.osMainVersion = osMainVersion;
    /**
     * Indicate the running browser type
     * @property {String} browserType
     */

    sys.browserType = sys.BROWSER_TYPE_UNKNOWN;
    /* Determine the browser type */

    (function () {
      var typeReg1 = /mqqbrowser|micromessenger|qqbrowser|sogou|qzone|liebao|maxthon|ucbs|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|miuibrowser/i;
      var typeReg2 = /qq|ucbrowser|ubrowser|edge/i;
      var typeReg3 = /chrome|safari|firefox|trident|opera|opr\/|oupeng/i;
      var browserTypes = typeReg1.exec(ua) || typeReg2.exec(ua) || typeReg3.exec(ua);
      var browserType = browserTypes ? browserTypes[0].toLowerCase() : sys.BROWSER_TYPE_UNKNOWN;
      if (browserType === "safari" && isAndroid) browserType = sys.BROWSER_TYPE_ANDROID;else if (browserType === "qq" && ua.match(/android.*applewebkit/i)) browserType = sys.BROWSER_TYPE_ANDROID;
      var typeMap = {
        'micromessenger': sys.BROWSER_TYPE_WECHAT,
        'trident': sys.BROWSER_TYPE_IE,
        'edge': sys.BROWSER_TYPE_EDGE,
        '360 aphone': sys.BROWSER_TYPE_360,
        'mxbrowser': sys.BROWSER_TYPE_MAXTHON,
        'opr/': sys.BROWSER_TYPE_OPERA,
        'ubrowser': sys.BROWSER_TYPE_UC
      };
      sys.browserType = typeMap[browserType] || browserType;
    })();
    /**
     * Indicate the running browser version
     * @property {String} browserVersion
     */


    sys.browserVersion = "";
    /* Determine the browser version number */

    (function () {
      var versionReg1 = /(mqqbrowser|micromessenger|qqbrowser|sogou|qzone|liebao|maxthon|uc|ucbs|360 aphone|360|baiduboxapp|baidu|maxthon|mxbrowser|miui(?:.hybrid)?)(mobile)?(browser)?\/?([\d.]+)/i;
      var versionReg2 = /(qq|chrome|safari|firefox|trident|opera|opr\/|oupeng)(mobile)?(browser)?\/?([\d.]+)/i;
      var tmp = ua.match(versionReg1);
      if (!tmp) tmp = ua.match(versionReg2);
      sys.browserVersion = tmp ? tmp[4] : "";
    })();

    var w = window.innerWidth || document.documentElement.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight;
    var ratio = window.devicePixelRatio || 1;
    /**
     * Indicate the real pixel resolution of the whole game window
     * @property {Size} windowPixelResolution
     */

    sys.windowPixelResolution = {
      width: ratio * w,
      height: ratio * h
    };

    sys._checkWebGLRenderMode = function () {
      if (cc.game.renderType !== cc.game.RENDER_TYPE_WEBGL) throw new Error("This feature supports WebGL render mode only.");
    };

    var _tmpCanvas1 = document.createElement("canvas");

    var create3DContext = function create3DContext(canvas, opt_attribs, opt_contextType) {
      if (opt_contextType) {
        try {
          return canvas.getContext(opt_contextType, opt_attribs);
        } catch (e) {
          return null;
        }
      } else {
        return create3DContext(canvas, opt_attribs, "webgl") || create3DContext(canvas, opt_attribs, "experimental-webgl") || create3DContext(canvas, opt_attribs, "webkit-3d") || create3DContext(canvas, opt_attribs, "moz-webgl") || null;
      }
    };
    /**
     * cc.sys.localStorage is a local storage component.
     * @property {Object} localStorage
     */


    try {
      var localStorage = sys.localStorage = win.localStorage;
      localStorage.setItem("storage", "");
      localStorage.removeItem("storage");
      localStorage = null;
    } catch (e) {
      var warn = function warn() {
        cc.warnID(5200);
      };

      sys.localStorage = {
        getItem: warn,
        setItem: warn,
        removeItem: warn,
        clear: warn
      };
    }

    var _supportWebp = _tmpCanvas1.toDataURL('image/webp').startsWith('data:image/webp');

    var _supportCanvas = !!_tmpCanvas1.getContext("2d");

    var _supportWebGL = false;

    if (CC_TEST) {
      _supportWebGL = false;
    } else if (win.WebGLRenderingContext) {
      _supportWebGL = true;
    }
    /**
     * The capabilities of the current platform
     * @property {Object} capabilities
     */


    var capabilities = sys.capabilities = {
      "canvas": _supportCanvas,
      "opengl": _supportWebGL,
      "webp": _supportWebp
    };
    if (docEle['ontouchstart'] !== undefined || doc['ontouchstart'] !== undefined || nav.msPointerEnabled) capabilities["touches"] = true;
    if (docEle['onmouseup'] !== undefined) capabilities["mouse"] = true;
    if (docEle['onkeyup'] !== undefined) capabilities["keyboard"] = true;
    if (win.DeviceMotionEvent || win.DeviceOrientationEvent) capabilities["accelerometer"] = true;

    if (!_supportWebp) {
      var webP = new Image();

      webP.onload = webP.onerror = function () {
        if (webP.height == 2) capabilities["webp"] = true;
      };

      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    var __audioSupport;
    /**
     * Audio support in the browser
     *
     * MULTI_CHANNEL        : Multiple audio while playing - If it doesn't, you can only play background music
     * WEB_AUDIO            : Support for WebAudio - Support W3C WebAudio standards, all of the audio can be played
     * AUTOPLAY             : Supports auto-play audio - if Don‘t support it, On a touch detecting background music canvas, and then replay
     * REPLAY_AFTER_TOUCH   : The first music will fail, must be replay after touchstart
     * USE_EMPTIED_EVENT    : Whether to use the emptied event to replace load callback
     * DELAY_CREATE_CTX     : delay created the context object - only webAudio
     * NEED_MANUAL_LOOP     : loop attribute failure, need to perform loop manually
     *
     * May be modifications for a few browser version
     */


    (function () {
      var DEBUG = false;
      var version = sys.browserVersion; // check if browser supports Web Audio
      // check Web Audio's context

      var supportWebAudio = !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
      __audioSupport = {
        ONLY_ONE: false,
        WEB_AUDIO: supportWebAudio,
        DELAY_CREATE_CTX: false
      };

      if (sys.os === sys.OS_IOS) {
        // IOS no event that used to parse completed callback
        // this time is not complete, can not play
        //
        __audioSupport.USE_LOADER_EVENT = 'loadedmetadata';
      }

      if (sys.browserType === sys.BROWSER_TYPE_FIREFOX) {
        __audioSupport.DELAY_CREATE_CTX = true;
        __audioSupport.USE_LOADER_EVENT = 'canplay';
      }

      if (sys.os === sys.OS_ANDROID) {
        if (sys.browserType === sys.BROWSER_TYPE_UC) {
          __audioSupport.ONE_SOURCE = true;
        }
      }

      if (DEBUG) {
        setTimeout(function () {
          cc.log('browse type: ' + sys.browserType);
          cc.log('browse version: ' + version);
          cc.log('MULTI_CHANNEL: ' + __audioSupport.MULTI_CHANNEL);
          cc.log('WEB_AUDIO: ' + __audioSupport.WEB_AUDIO);
          cc.log('AUTOPLAY: ' + __audioSupport.AUTOPLAY);
        }, 0);
      }
    })();

    try {
      if (__audioSupport.WEB_AUDIO) {
        __audioSupport.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();

        if (__audioSupport.DELAY_CREATE_CTX) {
          setTimeout(function () {
            __audioSupport.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
          }, 0);
        }
      }
    } catch (error) {
      __audioSupport.WEB_AUDIO = false;
      cc.logID(5201);
    }

    var formatSupport = [];

    (function () {
      var audio = document.createElement('audio');

      if (audio.canPlayType) {
        var ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
        if (ogg) formatSupport.push('.ogg');
        var mp3 = audio.canPlayType('audio/mpeg');
        if (mp3) formatSupport.push('.mp3');
        var wav = audio.canPlayType('audio/wav; codecs="1"');
        if (wav) formatSupport.push('.wav');
        var mp4 = audio.canPlayType('audio/mp4');
        if (mp4) formatSupport.push('.mp4');
        var m4a = audio.canPlayType('audio/x-m4a');
        if (m4a) formatSupport.push('.m4a');
      }
    })();

    __audioSupport.format = formatSupport;
    sys.__audioSupport = __audioSupport;
  }
  /**
   * !#en
   * Network type enumeration
   * !#zh
   * 网络类型枚举
   *
   * @enum sys.NetworkType
   */


  sys.NetworkType = {
    /**
     * !#en
     * Network is unreachable.
     * !#zh
     * 网络不通
     *
     * @property {Number} NONE
     */
    NONE: 0,

    /**
     * !#en
     * Network is reachable via WiFi or cable.
     * !#zh
     * 通过无线或者有线本地网络连接因特网
     *
     * @property {Number} LAN
     */
    LAN: 1,

    /**
     * !#en
     * Network is reachable via Wireless Wide Area Network
     * !#zh
     * 通过蜂窝移动网络连接因特网
     *
     * @property {Number} WWAN
     */
    WWAN: 2
  };
  /**
   * @class sys
   */

  /**
   * !#en
   * Get the network type of current device, return cc.sys.NetworkType.LAN if failure.
   * !#zh
   * 获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 cc.sys.NetworkType.LAN
   *
   * @method getNetworkType
   * @return {NetworkType}
   */

  sys.getNetworkType = function () {
    // TODO: need to implement this for mobile phones.
    return sys.NetworkType.LAN;
  };
  /**
   * !#en
   * Get the battery level of current device, return 1.0 if failure.
   * !#zh
   * 获取当前设备的电池电量，如果电量无法获取，默认将返回 1
   *
   * @method getBatteryLevel
   * @return {Number} - 0.0 ~ 1.0
   */


  sys.getBatteryLevel = function () {
    // TODO: need to implement this for mobile phones.
    return 1.0;
  };
  /**
   * Forces the garbage collection, only available in JSB
   * @method garbageCollect
   */


  sys.garbageCollect = function () {// N/A in web
  };
  /**
   * Restart the JS VM, only available in JSB
   * @method restartVM
   */


  sys.restartVM = function () {// N/A in web
  };
  /**
   * !#en
   * Return the safe area rect. <br/>
   * only available on the iOS native platform, otherwise it will return a rect with design resolution size.
   * !#zh
   * 返回手机屏幕安全区域，目前仅在 iOS 原生平台有效。其它平台将默认返回设计分辨率尺寸。
   * @method getSafeAreaRect
   * @return {Rect}
  */


  sys.getSafeAreaRect = function () {
    var visibleSize = cc.view.getVisibleSize();
    return cc.rect(0, 0, visibleSize.width, visibleSize.height);
  };
  /**
   * Check whether an object is valid,
   * In web engine, it will return true if the object exist
   * In native engine, it will return true if the JS object and the correspond native object are both valid
   * @method isObjectValid
   * @param {Object} obj
   * @return {Boolean} Validity of the object
   */


  sys.isObjectValid = function (obj) {
    if (obj) {
      return true;
    }

    return false;
  };
  /**
   * Dump system informations
   * @method dump
   */


  sys.dump = function () {
    var self = this;
    var str = "";
    str += "isMobile : " + self.isMobile + "\r\n";
    str += "language : " + self.language + "\r\n";
    str += "browserType : " + self.browserType + "\r\n";
    str += "browserVersion : " + self.browserVersion + "\r\n";
    str += "capabilities : " + JSON.stringify(self.capabilities) + "\r\n";
    str += "os : " + self.os + "\r\n";
    str += "osVersion : " + self.osVersion + "\r\n";
    str += "platform : " + self.platform + "\r\n";
    str += "Using " + (cc.game.renderType === cc.game.RENDER_TYPE_WEBGL ? "WEBGL" : "CANVAS") + " renderer." + "\r\n";
    cc.log(str);
  };
  /**
   * Open a url in browser
   * @method openURL
   * @param {String} url
   */


  sys.openURL = function (url) {
    if (CC_JSB || CC_RUNTIME) {
      jsb.openURL(url);
    } else {
      window.open(url);
    }
  };
  /**
   * Get the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
   * @method now
   * @return {Number}
   */


  sys.now = function () {
    if (Date.now) {
      return Date.now();
    } else {
      return +new Date();
    }
  };

  return sys;
}

var sys = cc && cc.sys ? cc.sys : initSys();
module.exports = sys;
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_engine__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU3lzLmpzIl0sIm5hbWVzIjpbInNldHRpbmdQbGF0Zm9ybSIsIkNDX0VESVRPUiIsIndpbmRvdyIsIl9DQ1NldHRpbmdzIiwicGxhdGZvcm0iLCJ1bmRlZmluZWQiLCJpc1Zpdm9HYW1lIiwiaXNPcHBvR2FtZSIsImlzSHVhd2VpR2FtZSIsImlzSktXR2FtZSIsImlzUXR0R2FtZSIsIl9nbG9iYWwiLCJnbG9iYWwiLCJpbml0U3lzIiwiY2MiLCJzeXMiLCJMQU5HVUFHRV9FTkdMSVNIIiwiTEFOR1VBR0VfQ0hJTkVTRSIsIkxBTkdVQUdFX0ZSRU5DSCIsIkxBTkdVQUdFX0lUQUxJQU4iLCJMQU5HVUFHRV9HRVJNQU4iLCJMQU5HVUFHRV9TUEFOSVNIIiwiTEFOR1VBR0VfRFVUQ0giLCJMQU5HVUFHRV9SVVNTSUFOIiwiTEFOR1VBR0VfS09SRUFOIiwiTEFOR1VBR0VfSkFQQU5FU0UiLCJMQU5HVUFHRV9IVU5HQVJJQU4iLCJMQU5HVUFHRV9QT1JUVUdVRVNFIiwiTEFOR1VBR0VfQVJBQklDIiwiTEFOR1VBR0VfTk9SV0VHSUFOIiwiTEFOR1VBR0VfUE9MSVNIIiwiTEFOR1VBR0VfVFVSS0lTSCIsIkxBTkdVQUdFX1VLUkFJTklBTiIsIkxBTkdVQUdFX1JPTUFOSUFOIiwiTEFOR1VBR0VfQlVMR0FSSUFOIiwiTEFOR1VBR0VfVU5LTk9XTiIsIk9TX0lPUyIsIk9TX0FORFJPSUQiLCJPU19XSU5ET1dTIiwiT1NfTUFSTUFMQURFIiwiT1NfTElOVVgiLCJPU19CQURBIiwiT1NfQkxBQ0tCRVJSWSIsIk9TX09TWCIsIk9TX1dQOCIsIk9TX1dJTlJUIiwiT1NfVU5LTk9XTiIsIlVOS05PV04iLCJXSU4zMiIsIkxJTlVYIiwiTUFDT1MiLCJBTkRST0lEIiwiSVBIT05FIiwiSVBBRCIsIkJMQUNLQkVSUlkiLCJOQUNMIiwiRU1TQ1JJUFRFTiIsIlRJWkVOIiwiV0lOUlQiLCJXUDgiLCJNT0JJTEVfQlJPV1NFUiIsIkRFU0tUT1BfQlJPV1NFUiIsIkVESVRPUl9QQUdFIiwiRURJVE9SX0NPUkUiLCJXRUNIQVRfR0FNRSIsIlFRX1BMQVkiLCJGQl9QTEFZQUJMRV9BRFMiLCJCQUlEVV9HQU1FIiwiVklWT19HQU1FIiwiT1BQT19HQU1FIiwiSFVBV0VJX0dBTUUiLCJYSUFPTUlfR0FNRSIsIkpLV19HQU1FIiwiQUxJUEFZX0dBTUUiLCJXRUNIQVRfR0FNRV9TVUIiLCJCQUlEVV9HQU1FX1NVQiIsIlFUVF9HQU1FIiwiQlJPV1NFUl9UWVBFX1dFQ0hBVCIsIkJST1dTRVJfVFlQRV9XRUNIQVRfR0FNRSIsIkJST1dTRVJfVFlQRV9XRUNIQVRfR0FNRV9TVUIiLCJCUk9XU0VSX1RZUEVfQkFJRFVfR0FNRSIsIkJST1dTRVJfVFlQRV9CQUlEVV9HQU1FX1NVQiIsIkJST1dTRVJfVFlQRV9YSUFPTUlfR0FNRSIsIkJST1dTRVJfVFlQRV9BTElQQVlfR0FNRSIsIkJST1dTRVJfVFlQRV9RUV9QTEFZIiwiQlJPV1NFUl9UWVBFX0FORFJPSUQiLCJCUk9XU0VSX1RZUEVfSUUiLCJCUk9XU0VSX1RZUEVfRURHRSIsIkJST1dTRVJfVFlQRV9RUSIsIkJST1dTRVJfVFlQRV9NT0JJTEVfUVEiLCJCUk9XU0VSX1RZUEVfVUMiLCJCUk9XU0VSX1RZUEVfVUNCUyIsIkJST1dTRVJfVFlQRV8zNjAiLCJCUk9XU0VSX1RZUEVfQkFJRFVfQVBQIiwiQlJPV1NFUl9UWVBFX0JBSURVIiwiQlJPV1NFUl9UWVBFX01BWFRIT04iLCJCUk9XU0VSX1RZUEVfT1BFUkEiLCJCUk9XU0VSX1RZUEVfT1VQRU5HIiwiQlJPV1NFUl9UWVBFX01JVUkiLCJCUk9XU0VSX1RZUEVfRklSRUZPWCIsIkJST1dTRVJfVFlQRV9TQUZBUkkiLCJCUk9XU0VSX1RZUEVfQ0hST01FIiwiQlJPV1NFUl9UWVBFX0xJRUJBTyIsIkJST1dTRVJfVFlQRV9RWk9ORSIsIkJST1dTRVJfVFlQRV9TT1VHT1UiLCJCUk9XU0VSX1RZUEVfVU5LTk9XTiIsImlzTmF0aXZlIiwiQ0NfSlNCIiwiQ0NfUlVOVElNRSIsImlzQnJvd3NlciIsImRvY3VtZW50IiwiZ2xFeHRlbnNpb24iLCJuYW1lIiwicmVuZGVyZXIiLCJkZXZpY2UiLCJleHQiLCJnZXRNYXhKb2ludE1hdHJpeFNpemUiLCJfbWF4Sm9pbnRNYXRyaXhTaXplIiwiSk9JTlRfTUFUUklDRVNfU0laRSIsIkxFRlRfVU5JRk9STV9TSVpFIiwiZ2wiLCJnYW1lIiwiX3JlbmRlckNvbnRleHQiLCJtYXhVbmlmb3JtcyIsIk1hdGgiLCJmbG9vciIsImdldFBhcmFtZXRlciIsIk1BWF9WRVJURVhfVU5JRk9STV9WRUNUT1JTIiwiX19nbG9iYWxBZGFwdGVyIiwiYWRhcHRTeXMiLCJFZGl0b3IiLCJpc01haW5Qcm9jZXNzIiwiaXNNb2JpbGUiLCJsYW5ndWFnZSIsImxhbmd1YWdlQ29kZSIsIm9zIiwiZGFyd2luIiwid2luMzIiLCJsaW51eCIsInByb2Nlc3MiLCJicm93c2VyVHlwZSIsImJyb3dzZXJWZXJzaW9uIiwid2luZG93UGl4ZWxSZXNvbHV0aW9uIiwid2lkdGgiLCJoZWlnaHQiLCJfX2F1ZGlvU3VwcG9ydCIsIl9fZ2V0UGxhdGZvcm0iLCJfX2dldE9TIiwiX19nZXRDdXJyZW50TGFuZ3VhZ2UiLCJfX2dldEN1cnJlbnRMYW5ndWFnZUNvZGUiLCJ0b0xvd2VyQ2FzZSIsIm9zVmVyc2lvbiIsIl9fZ2V0T1NWZXJzaW9uIiwib3NNYWluVmVyc2lvbiIsInBhcnNlSW50IiwidyIsImlubmVyV2lkdGgiLCJoIiwiaW5uZXJIZWlnaHQiLCJyYXRpbyIsImRldmljZVBpeGVsUmF0aW8iLCJsb2NhbFN0b3JhZ2UiLCJjYXBhYmlsaXRpZXMiLCJPTkxZX09ORSIsIldFQl9BVURJTyIsIkRFTEFZX0NSRUFURV9DVFgiLCJmb3JtYXQiLCJ3aW4iLCJuYXYiLCJuYXZpZ2F0b3IiLCJkb2MiLCJkb2NFbGUiLCJkb2N1bWVudEVsZW1lbnQiLCJ1YSIsInVzZXJBZ2VudCIsInRlc3QiLCJGYlBsYXlhYmxlQWQiLCJjdXJyTGFuZ3VhZ2UiLCJicm93c2VyTGFuZ3VhZ2UiLCJzcGxpdCIsImlzQW5kcm9pZCIsImlPUyIsInVhUmVzdWx0IiwiZXhlYyIsIm1heFRvdWNoUG9pbnRzIiwib3NOYW1lIiwiYXBwVmVyc2lvbiIsImluZGV4T2YiLCJPU19VTklYIiwidHlwZVJlZzEiLCJ0eXBlUmVnMiIsInR5cGVSZWczIiwiYnJvd3NlclR5cGVzIiwibWF0Y2giLCJ0eXBlTWFwIiwidmVyc2lvblJlZzEiLCJ2ZXJzaW9uUmVnMiIsInRtcCIsImNsaWVudFdpZHRoIiwiY2xpZW50SGVpZ2h0IiwiX2NoZWNrV2ViR0xSZW5kZXJNb2RlIiwicmVuZGVyVHlwZSIsIlJFTkRFUl9UWVBFX1dFQkdMIiwiRXJyb3IiLCJfdG1wQ2FudmFzMSIsImNyZWF0ZUVsZW1lbnQiLCJjcmVhdGUzRENvbnRleHQiLCJjYW52YXMiLCJvcHRfYXR0cmlicyIsIm9wdF9jb250ZXh0VHlwZSIsImdldENvbnRleHQiLCJlIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJ3YXJuIiwid2FybklEIiwiZ2V0SXRlbSIsImNsZWFyIiwiX3N1cHBvcnRXZWJwIiwidG9EYXRhVVJMIiwic3RhcnRzV2l0aCIsIl9zdXBwb3J0Q2FudmFzIiwiX3N1cHBvcnRXZWJHTCIsIkNDX1RFU1QiLCJXZWJHTFJlbmRlcmluZ0NvbnRleHQiLCJtc1BvaW50ZXJFbmFibGVkIiwiRGV2aWNlTW90aW9uRXZlbnQiLCJEZXZpY2VPcmllbnRhdGlvbkV2ZW50Iiwid2ViUCIsIkltYWdlIiwib25sb2FkIiwib25lcnJvciIsInNyYyIsIkRFQlVHIiwidmVyc2lvbiIsInN1cHBvcnRXZWJBdWRpbyIsIkF1ZGlvQ29udGV4dCIsIndlYmtpdEF1ZGlvQ29udGV4dCIsIm1vekF1ZGlvQ29udGV4dCIsIlVTRV9MT0FERVJfRVZFTlQiLCJPTkVfU09VUkNFIiwic2V0VGltZW91dCIsImxvZyIsIk1VTFRJX0NIQU5ORUwiLCJBVVRPUExBWSIsImNvbnRleHQiLCJlcnJvciIsImxvZ0lEIiwiZm9ybWF0U3VwcG9ydCIsImF1ZGlvIiwiY2FuUGxheVR5cGUiLCJvZ2ciLCJwdXNoIiwibXAzIiwid2F2IiwibXA0IiwibTRhIiwiTmV0d29ya1R5cGUiLCJOT05FIiwiTEFOIiwiV1dBTiIsImdldE5ldHdvcmtUeXBlIiwiZ2V0QmF0dGVyeUxldmVsIiwiZ2FyYmFnZUNvbGxlY3QiLCJyZXN0YXJ0Vk0iLCJnZXRTYWZlQXJlYVJlY3QiLCJ2aXNpYmxlU2l6ZSIsInZpZXciLCJnZXRWaXNpYmxlU2l6ZSIsInJlY3QiLCJpc09iamVjdFZhbGlkIiwib2JqIiwiZHVtcCIsInNlbGYiLCJzdHIiLCJKU09OIiwic3RyaW5naWZ5Iiwib3BlblVSTCIsInVybCIsImpzYiIsIm9wZW4iLCJub3ciLCJEYXRlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQUlBLGVBQUo7O0FBQ0MsSUFBSSxDQUFDQyxTQUFMLEVBQWdCO0FBQ2JELEVBQUFBLGVBQWUsR0FBR0UsTUFBTSxDQUFDQyxXQUFQLEdBQXFCQSxXQUFXLENBQUNDLFFBQWpDLEdBQTJDQyxTQUE3RDtBQUNGOztBQUNGLElBQU1DLFVBQVUsR0FBSU4sZUFBZSxLQUFLLE9BQXhDO0FBQ0EsSUFBTU8sVUFBVSxHQUFJUCxlQUFlLEtBQUssV0FBeEM7QUFDQSxJQUFNUSxZQUFZLEdBQUlSLGVBQWUsS0FBSyxRQUExQztBQUNBLElBQU1TLFNBQVMsR0FBSVQsZUFBZSxLQUFLLFVBQXZDO0FBQ0EsSUFBTVUsU0FBUyxHQUFJVixlQUFlLEtBQUssVUFBdkM7O0FBRUEsSUFBTVcsT0FBTyxHQUFHLE9BQU9ULE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0NVLE1BQWhDLEdBQXlDVixNQUF6RDs7QUFFQSxTQUFTVyxPQUFULEdBQW9CO0FBQ2hCOzs7Ozs7QUFNQUMsRUFBQUEsRUFBRSxDQUFDQyxHQUFILEdBQVMsRUFBVDtBQUNBLE1BQUlBLEdBQUcsR0FBR0QsRUFBRSxDQUFDQyxHQUFiO0FBRUE7Ozs7OztBQUtBQSxFQUFBQSxHQUFHLENBQUNDLGdC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SUEsR0FBRyxHQUFHRCxFQUFFLElBQUlBLEVBQUUsQ0FBQ0MsR0FBVCxHQUFlRCxFQUFFLENBQUNDLEdBQWxCLEdBQXdCRixPQUFPLEVBQXpDO0FBRUE4USxNQUFNLENBQUNDLE9BQVAsR0FBaUI3USxHQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxubGV0IHNldHRpbmdQbGF0Zm9ybTtcbiBpZiAoIUNDX0VESVRPUikge1xuICAgIHNldHRpbmdQbGF0Zm9ybSA9IHdpbmRvdy5fQ0NTZXR0aW5ncyA/IF9DQ1NldHRpbmdzLnBsYXRmb3JtOiB1bmRlZmluZWQ7XG4gfVxuY29uc3QgaXNWaXZvR2FtZSA9IChzZXR0aW5nUGxhdGZvcm0gPT09ICdxZ2FtZScpO1xuY29uc3QgaXNPcHBvR2FtZSA9IChzZXR0aW5nUGxhdGZvcm0gPT09ICdxdWlja2dhbWUnKTtcbmNvbnN0IGlzSHVhd2VpR2FtZSA9IChzZXR0aW5nUGxhdGZvcm0gPT09ICdodWF3ZWknKTtcbmNvbnN0IGlzSktXR2FtZSA9IChzZXR0aW5nUGxhdGZvcm0gPT09ICdqa3ctZ2FtZScpO1xuY29uc3QgaXNRdHRHYW1lID0gKHNldHRpbmdQbGF0Zm9ybSA9PT0gJ3F0dC1nYW1lJyk7XG5cbmNvbnN0IF9nbG9iYWwgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdztcbiBcbmZ1bmN0aW9uIGluaXRTeXMgKCkge1xuICAgIC8qKlxuICAgICAqIFN5c3RlbSB2YXJpYWJsZXNcbiAgICAgKiBAY2xhc3Mgc3lzXG4gICAgICogQG1haW5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgY2Muc3lzID0ge307XG4gICAgdmFyIHN5cyA9IGNjLnN5cztcblxuICAgIC8qKlxuICAgICAqIEVuZ2xpc2ggbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9FTkdMSVNIXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX0VOR0xJU0ggPSBcImVuXCI7XG5cbiAgICAvKipcbiAgICAgKiBDaGluZXNlIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfQ0hJTkVTRVxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9DSElORVNFID0gXCJ6aFwiO1xuXG4gICAgLyoqXG4gICAgICogRnJlbmNoIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfRlJFTkNIXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX0ZSRU5DSCA9IFwiZnJcIjtcblxuICAgIC8qKlxuICAgICAqIEl0YWxpYW4gbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9JVEFMSUFOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX0lUQUxJQU4gPSBcIml0XCI7XG5cbiAgICAvKipcbiAgICAgKiBHZXJtYW4gbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9HRVJNQU5cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfR0VSTUFOID0gXCJkZVwiO1xuXG4gICAgLyoqXG4gICAgICogU3BhbmlzaCBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX1NQQU5JU0hcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfU1BBTklTSCA9IFwiZXNcIjtcblxuICAgIC8qKlxuICAgICAqIFNwYW5pc2ggbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9EVVRDSFxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9EVVRDSCA9IFwiZHVcIjtcblxuICAgIC8qKlxuICAgICAqIFJ1c3NpYW4gbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9SVVNTSUFOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX1JVU1NJQU4gPSBcInJ1XCI7XG5cbiAgICAvKipcbiAgICAgKiBLb3JlYW4gbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9LT1JFQU5cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfS09SRUFOID0gXCJrb1wiO1xuXG4gICAgLyoqXG4gICAgICogSmFwYW5lc2UgbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9KQVBBTkVTRVxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9KQVBBTkVTRSA9IFwiamFcIjtcblxuICAgIC8qKlxuICAgICAqIEh1bmdhcmlhbiBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX0hVTkdBUklBTlxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9IVU5HQVJJQU4gPSBcImh1XCI7XG5cbiAgICAvKipcbiAgICAgKiBQb3J0dWd1ZXNlIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfUE9SVFVHVUVTRVxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9QT1JUVUdVRVNFID0gXCJwdFwiO1xuXG4gICAgLyoqXG4gICAgICogQXJhYmljIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfQVJBQklDXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX0FSQUJJQyA9IFwiYXJcIjtcblxuICAgIC8qKlxuICAgICAqIE5vcndlZ2lhbiBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX05PUldFR0lBTlxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9OT1JXRUdJQU4gPSBcIm5vXCI7XG5cbiAgICAvKipcbiAgICAgKiBQb2xpc2ggbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9QT0xJU0hcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfUE9MSVNIID0gXCJwbFwiO1xuXG4gICAgLyoqXG4gICAgICogVHVya2lzaCBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX1RVUktJU0hcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuTEFOR1VBR0VfVFVSS0lTSCA9IFwidHJcIjtcblxuICAgIC8qKlxuICAgICAqIFVrcmFpbmlhbiBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX1VLUkFJTklBTlxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5MQU5HVUFHRV9VS1JBSU5JQU4gPSBcInVrXCI7XG5cbiAgICAvKipcbiAgICAgKiBSb21hbmlhbiBsYW5ndWFnZSBjb2RlXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IExBTkdVQUdFX1JPTUFOSUFOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX1JPTUFOSUFOID0gXCJyb1wiO1xuXG4gICAgLyoqXG4gICAgICogQnVsZ2FyaWFuIGxhbmd1YWdlIGNvZGVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTEFOR1VBR0VfQlVMR0FSSUFOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX0JVTEdBUklBTiA9IFwiYmdcIjtcblxuICAgIC8qKlxuICAgICAqIFVua25vd24gbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMQU5HVUFHRV9VTktOT1dOXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLkxBTkdVQUdFX1VOS05PV04gPSBcInVua25vd25cIjtcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBPU19JT1NcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuT1NfSU9TID0gXCJpT1NcIjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gT1NfQU5EUk9JRFxuICAgICAqIEByZWFkT25seVxuICAgICAqL1xuICAgIHN5cy5PU19BTkRST0lEID0gXCJBbmRyb2lkXCI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE9TX1dJTkRPV1NcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuT1NfV0lORE9XUyA9IFwiV2luZG93c1wiO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBPU19NQVJNQUxBREVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuT1NfTUFSTUFMQURFID0gXCJNYXJtYWxhZGVcIjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gT1NfTElOVVhcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuT1NfTElOVVggPSBcIkxpbnV4XCI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE9TX0JBREFcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuT1NfQkFEQSA9IFwiQmFkYVwiO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBPU19CTEFDS0JFUlJZXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLk9TX0JMQUNLQkVSUlkgPSBcIkJsYWNrYmVycnlcIjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gT1NfT1NYXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgc3lzLk9TX09TWCA9IFwiT1MgWFwiO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBPU19XUDhcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuT1NfV1A4ID0gXCJXUDhcIjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gT1NfV0lOUlRcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuT1NfV0lOUlQgPSBcIldJTlJUXCI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE9TX1VOS05PV05cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKi9cbiAgICBzeXMuT1NfVU5LTk9XTiA9IFwiVW5rbm93blwiO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFVOS05PV05cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAtMVxuICAgICAqL1xuICAgIHN5cy5VTktOT1dOID0gLTE7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFdJTjMyXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMFxuICAgICAqL1xuICAgIHN5cy5XSU4zMiA9IDA7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IExJTlVYXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMVxuICAgICAqL1xuICAgIHN5cy5MSU5VWCA9IDE7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE1BQ09TXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMlxuICAgICAqL1xuICAgIHN5cy5NQUNPUyA9IDI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEFORFJPSURcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAzXG4gICAgICovXG4gICAgc3lzLkFORFJPSUQgPSAzO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBJUEhPTkVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCA0XG4gICAgICovXG4gICAgc3lzLklQSE9ORSA9IDQ7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IElQQURcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCA1XG4gICAgICovXG4gICAgc3lzLklQQUQgPSA1O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBCTEFDS0JFUlJZXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgNlxuICAgICAqL1xuICAgIHN5cy5CTEFDS0JFUlJZID0gNjtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTkFDTFxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDdcbiAgICAgKi9cbiAgICBzeXMuTkFDTCA9IDc7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEVNU0NSSVBURU5cbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCA4XG4gICAgICovXG4gICAgc3lzLkVNU0NSSVBURU4gPSA4O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBUSVpFTlxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDlcbiAgICAgKi9cbiAgICBzeXMuVElaRU4gPSA5O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBXSU5SVFxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDEwXG4gICAgICovXG4gICAgc3lzLldJTlJUID0gMTA7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFdQOFxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDExXG4gICAgICovXG4gICAgc3lzLldQOCA9IDExO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBNT0JJTEVfQlJPV1NFUlxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDEwMFxuICAgICAqL1xuICAgIHN5cy5NT0JJTEVfQlJPV1NFUiA9IDEwMDtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gREVTS1RPUF9CUk9XU0VSXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTAxXG4gICAgICovXG4gICAgc3lzLkRFU0tUT1BfQlJPV1NFUiA9IDEwMTtcblxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyB3aGV0aGVyIGV4ZWN1dGVzIGluIGVkaXRvcidzIHdpbmRvdyBwcm9jZXNzIChFbGVjdHJvbidzIHJlbmRlcmVyIGNvbnRleHQpXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEVESVRPUl9QQUdFXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTAyXG4gICAgICovXG4gICAgc3lzLkVESVRPUl9QQUdFID0gMTAyO1xuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyB3aGV0aGVyIGV4ZWN1dGVzIGluIGVkaXRvcidzIG1haW4gcHJvY2VzcyAoRWxlY3Ryb24ncyBicm93c2VyIGNvbnRleHQpXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEVESVRPUl9DT1JFXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTAzXG4gICAgICovXG4gICAgc3lzLkVESVRPUl9DT1JFID0gMTAzO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBXRUNIQVRfR0FNRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDEwNFxuICAgICAqL1xuICAgIHN5cy5XRUNIQVRfR0FNRSA9IDEwNDtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUVFfUExBWVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDEwNVxuICAgICAqL1xuICAgIHN5cy5RUV9QTEFZID0gMTA1O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBGQl9QTEFZQUJMRV9BRFNcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMDZcbiAgICAgKi9cbiAgICBzeXMuRkJfUExBWUFCTEVfQURTID0gMTA2O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBCQUlEVV9HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTA3XG4gICAgICovXG4gICAgc3lzLkJBSURVX0dBTUUgPSAxMDc7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFZJVk9fR0FNRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDEwOFxuICAgICAqL1xuICAgIHN5cy5WSVZPX0dBTUUgPSAxMDg7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE9QUE9fR0FNRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDEwOVxuICAgICAqL1xuICAgIHN5cy5PUFBPX0dBTUUgPSAxMDk7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEhVQVdFSV9HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTEwXG4gICAgICovXG4gICAgc3lzLkhVQVdFSV9HQU1FID0gMTEwO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBYSUFPTUlfR0FNRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDExMVxuICAgICAqL1xuICAgIHN5cy5YSUFPTUlfR0FNRSA9IDExMTtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gSktXX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMTJcbiAgICAgKi9cbiAgICBzeXMuSktXX0dBTUUgPSAxMTI7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEFMSVBBWV9HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgMTEzXG4gICAgICovXG4gICAgc3lzLkFMSVBBWV9HQU1FID0gMTEzO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBXRUNIQVRfR0FNRV9TVUJcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMTRcbiAgICAgKi9cbiAgICBzeXMuV0VDSEFUX0dBTUVfU1VCID0gMTE0O1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBCQUlEVV9HQU1FX1NVQlxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IDExNVxuICAgICAqL1xuICAgIHN5cy5CQUlEVV9HQU1FX1NVQiA9IDExNTtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUVRUX0dBTUVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCAxMTZcbiAgICAgKi9cbiAgICBzeXMuUVRUX0dBTUUgPSAxMTY7XG4gICAgLyoqXG4gICAgICogQlJPV1NFUl9UWVBFX1dFQ0hBVFxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfV0VDSEFUXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJ3ZWNoYXRcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfV0VDSEFUID0gXCJ3ZWNoYXRcIjtcbiAgICAvKipcbiAgICAgKiBCUk9XU0VSX1RZUEVfV0VDSEFUX0dBTUVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX1dFQ0hBVF9HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJ3ZWNoYXRnYW1lXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX1dFQ0hBVF9HQU1FID0gXCJ3ZWNoYXRnYW1lXCI7XG4gICAgLyoqXG4gICAgICogQlJPV1NFUl9UWVBFX1dFQ0hBVF9HQU1FX1NVQlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfV0VDSEFUX0dBTUVfU1VCXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJ3ZWNoYXRnYW1lc3ViXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX1dFQ0hBVF9HQU1FX1NVQiA9IFwid2VjaGF0Z2FtZXN1YlwiO1xuICAgIC8qKlxuICAgICAqIEJST1dTRVJfVFlQRV9CQUlEVV9HQU1FXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9CQUlEVV9HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJiYWlkdWdhbWVcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfQkFJRFVfR0FNRSA9IFwiYmFpZHVnYW1lXCI7XG4gICAgLyoqXG4gICAgICogQlJPV1NFUl9UWVBFX0JBSURVX0dBTUVfU1VCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9CQUlEVV9HQU1FX1NVQlxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwiYmFpZHVnYW1lc3ViXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX0JBSURVX0dBTUVfU1VCID0gXCJiYWlkdWdhbWVzdWJcIjtcbiAgICAvKipcbiAgICAgKiBCUk9XU0VSX1RZUEVfWElBT01JX0dBTUVcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX1hJQU9NSV9HQU1FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJ4aWFvbWlnYW1lXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX1hJQU9NSV9HQU1FID0gXCJ4aWFvbWlnYW1lXCI7XG4gICAgLyoqXG4gICAgICogQlJPV1NFUl9UWVBFX0FMSVBBWV9HQU1FXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9BTElQQVlfR0FNRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwiYWxpcGF5Z2FtZVwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9BTElQQVlfR0FNRSA9IFwiYWxpcGF5Z2FtZVwiO1xuICAgIC8qKlxuICAgICAqIEJST1dTRVJfVFlQRV9RUV9QTEFZXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9RUV9QTEFZXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJxcXBsYXlcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfUVFfUExBWSA9IFwicXFwbGF5XCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX0FORFJPSURcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcImFuZHJvaWRicm93c2VyXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX0FORFJPSUQgPSBcImFuZHJvaWRicm93c2VyXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX0lFXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJpZVwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9JRSA9IFwiaWVcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfRURHRVxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwiZWRnZVwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9FREdFID0gXCJlZGdlXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX1FRXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJxcWJyb3dzZXJcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfUVEgPSBcInFxYnJvd3NlclwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9NT0JJTEVfUVFcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcIm1xcWJyb3dzZXJcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfTU9CSUxFX1FRID0gXCJtcXFicm93c2VyXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX1VDXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJ1Y2Jyb3dzZXJcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfVUMgPSBcInVjYnJvd3NlclwiO1xuICAgIC8qKlxuICAgICAqIHVjIHRoaXJkIHBhcnR5IGludGVncmF0aW9uLlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfVUNCU1xuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwidWNic1wiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9VQ0JTID0gXCJ1Y2JzXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFXzM2MFxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwiMzYwYnJvd3NlclwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV8zNjAgPSBcIjM2MGJyb3dzZXJcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfQkFJRFVfQVBQXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJiYWlkdWJveGFwcFwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9CQUlEVV9BUFAgPSBcImJhaWR1Ym94YXBwXCI7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQlJPV1NFUl9UWVBFX0JBSURVXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJiYWlkdWJyb3dzZXJcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfQkFJRFUgPSBcImJhaWR1YnJvd3NlclwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9NQVhUSE9OXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJtYXh0aG9uXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX01BWFRIT04gPSBcIm1heHRob25cIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfT1BFUkFcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcIm9wZXJhXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX09QRVJBID0gXCJvcGVyYVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9PVVBFTkdcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcIm91cGVuZ1wiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9PVVBFTkcgPSBcIm91cGVuZ1wiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9NSVVJXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJtaXVpYnJvd3NlclwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9NSVVJID0gXCJtaXVpYnJvd3NlclwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9GSVJFRk9YXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJmaXJlZm94XCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX0ZJUkVGT1ggPSBcImZpcmVmb3hcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfU0FGQVJJXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJzYWZhcmlcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfU0FGQVJJID0gXCJzYWZhcmlcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfQ0hST01FXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJjaHJvbWVcIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfQ0hST01FID0gXCJjaHJvbWVcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfTElFQkFPXG4gICAgICogQHJlYWRPbmx5XG4gICAgICogQGRlZmF1bHQgXCJsaWViYW9cIlxuICAgICAqL1xuICAgIHN5cy5CUk9XU0VSX1RZUEVfTElFQkFPID0gXCJsaWViYW9cIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfUVpPTkVcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcInF6b25lXCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX1FaT05FID0gXCJxem9uZVwiO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEJST1dTRVJfVFlQRV9TT1VHT1VcbiAgICAgKiBAcmVhZE9ubHlcbiAgICAgKiBAZGVmYXVsdCBcInNvZ291XCJcbiAgICAgKi9cbiAgICBzeXMuQlJPV1NFUl9UWVBFX1NPVUdPVSA9IFwic29nb3VcIjtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBCUk9XU0VSX1RZUEVfVU5LTk9XTlxuICAgICAqIEByZWFkT25seVxuICAgICAqIEBkZWZhdWx0IFwidW5rbm93blwiXG4gICAgICovXG4gICAgc3lzLkJST1dTRVJfVFlQRV9VTktOT1dOID0gXCJ1bmtub3duXCI7XG5cbiAgICAvKipcbiAgICAgKiBJcyBuYXRpdmUgPyBUaGlzIGlzIHNldCB0byBiZSB0cnVlIGluIGpzYiBhdXRvLlxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNOYXRpdmVcbiAgICAgKi9cbiAgICBzeXMuaXNOYXRpdmUgPSBDQ19KU0IgfHwgQ0NfUlVOVElNRTtcblxuXG4gICAgLyoqXG4gICAgICogSXMgd2ViIGJyb3dzZXIgP1xuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNCcm93c2VyXG4gICAgICovXG4gICAgc3lzLmlzQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmIHR5cGVvZiBkb2N1bWVudCA9PT0gJ29iamVjdCcgJiYgIUNDX0pTQiAmJiAhQ0NfUlVOVElNRTtcblxuICAgIC8qKlxuICAgICAqIElzIHdlYmdsIGV4dGVuc2lvbiBzdXBwb3J0P1xuICAgICAqIEBtZXRob2QgZ2xFeHRlbnNpb25cbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqL1xuICAgIHN5cy5nbEV4dGVuc2lvbiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHJldHVybiAhIWNjLnJlbmRlcmVyLmRldmljZS5leHQobmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG1heCBqb2ludCBtYXRyaXggc2l6ZSBmb3Igc2tpbm5lZCBtZXNoIHJlbmRlcmVyLlxuICAgICAqIEBtZXRob2QgZ2V0TWF4Sm9pbnRNYXRyaXhTaXplXG4gICAgICovXG4gICAgc3lzLmdldE1heEpvaW50TWF0cml4U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFzeXMuX21heEpvaW50TWF0cml4U2l6ZSkge1xuICAgICAgICAgICAgY29uc3QgSk9JTlRfTUFUUklDRVNfU0laRSA9IDUwO1xuICAgICAgICAgICAgY29uc3QgTEVGVF9VTklGT1JNX1NJWkUgPSAxMDtcblxuICAgICAgICAgICAgbGV0IGdsID0gY2MuZ2FtZS5fcmVuZGVyQ29udGV4dDtcbiAgICAgICAgICAgIGxldCBtYXhVbmlmb3JtcyA9IE1hdGguZmxvb3IoZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9WRVJURVhfVU5JRk9STV9WRUNUT1JTKSAvIDQpIC0gTEVGVF9VTklGT1JNX1NJWkU7XG4gICAgICAgICAgICBpZiAobWF4VW5pZm9ybXMgPCBKT0lOVF9NQVRSSUNFU19TSVpFKSB7XG4gICAgICAgICAgICAgICAgc3lzLl9tYXhKb2ludE1hdHJpeFNpemUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3lzLl9tYXhKb2ludE1hdHJpeFNpemUgPSBKT0lOVF9NQVRSSUNFU19TSVpFO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzeXMuX21heEpvaW50TWF0cml4U2l6ZTtcbiAgICB9XG5cbiAgICBpZiAoX2dsb2JhbC5fX2dsb2JhbEFkYXB0ZXIgJiYgX2dsb2JhbC5fX2dsb2JhbEFkYXB0ZXIuYWRhcHRTeXMpIHtcbiAgICAgICAgLy8gaW5pdCBzeXMgaW5mbyBpbiBhZGFwdGVyXG4gICAgICAgIF9nbG9iYWwuX19nbG9iYWxBZGFwdGVyLmFkYXB0U3lzKHN5cyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKENDX0VESVRPUiAmJiBFZGl0b3IuaXNNYWluUHJvY2Vzcykge1xuICAgICAgICBzeXMuaXNNb2JpbGUgPSBmYWxzZTtcbiAgICAgICAgc3lzLnBsYXRmb3JtID0gc3lzLkVESVRPUl9DT1JFO1xuICAgICAgICBzeXMubGFuZ3VhZ2UgPSBzeXMuTEFOR1VBR0VfVU5LTk9XTjtcbiAgICAgICAgc3lzLmxhbmd1YWdlQ29kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgc3lzLm9zID0gKHtcbiAgICAgICAgICAgIGRhcndpbjogc3lzLk9TX09TWCxcbiAgICAgICAgICAgIHdpbjMyOiBzeXMuT1NfV0lORE9XUyxcbiAgICAgICAgICAgIGxpbnV4OiBzeXMuT1NfTElOVVhcbiAgICAgICAgfSlbcHJvY2Vzcy5wbGF0Zm9ybV0gfHwgc3lzLk9TX1VOS05PV047XG4gICAgICAgIHN5cy5icm93c2VyVHlwZSA9IG51bGw7XG4gICAgICAgIHN5cy5icm93c2VyVmVyc2lvbiA9IG51bGw7XG4gICAgICAgIHN5cy53aW5kb3dQaXhlbFJlc29sdXRpb24gPSB7XG4gICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMFxuICAgICAgICB9O1xuICAgICAgICBzeXMuX19hdWRpb1N1cHBvcnQgPSB7fTtcbiAgICB9XG4gICAgZWxzZSBpZiAoQ0NfSlNCIHx8IENDX1JVTlRJTUUpIHtcbiAgICAgICAgbGV0IHBsYXRmb3JtO1xuICAgICAgICBpZiAoaXNWaXZvR2FtZSkge1xuICAgICAgICAgICAgcGxhdGZvcm0gPSBzeXMuVklWT19HQU1FO1xuICAgICAgICB9IGVsc2UgaWYgKGlzT3Bwb0dhbWUpIHtcbiAgICAgICAgICAgIHBsYXRmb3JtID0gc3lzLk9QUE9fR0FNRTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0h1YXdlaUdhbWUpIHtcbiAgICAgICAgICAgIHBsYXRmb3JtID0gc3lzLkhVQVdFSV9HQU1FO1xuICAgICAgICB9IGVsc2UgaWYgKGlzSktXR2FtZSkge1xuICAgICAgICAgICAgcGxhdGZvcm0gPSBzeXMuSktXX0dBTUU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNRdHRHYW1lKSB7XG4gICAgICAgICAgICBwbGF0Zm9ybSA9IHN5cy5RVFRfR0FNRTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBsYXRmb3JtID0gX19nZXRQbGF0Zm9ybSgpO1xuICAgICAgICB9XG4gICAgICAgIHN5cy5wbGF0Zm9ybSA9IHBsYXRmb3JtO1xuICAgICAgICBzeXMuaXNNb2JpbGUgPSAocGxhdGZvcm0gPT09IHN5cy5BTkRST0lEIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybSA9PT0gc3lzLklQQUQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXRmb3JtID09PSBzeXMuSVBIT05FIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybSA9PT0gc3lzLldQOCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhdGZvcm0gPT09IHN5cy5USVpFTiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhdGZvcm0gPT09IHN5cy5CTEFDS0JFUlJZIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybSA9PT0gc3lzLlhJQU9NSV9HQU1FIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1Zpdm9HYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBpc09wcG9HYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0h1YXdlaUdhbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzSktXR2FtZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNRdHRHYW1lKTtcblxuICAgICAgICBzeXMub3MgPSBfX2dldE9TKCk7XG4gICAgICAgIHN5cy5sYW5ndWFnZSA9IF9fZ2V0Q3VycmVudExhbmd1YWdlKCk7XG4gICAgICAgIHZhciBsYW5ndWFnZUNvZGU7IFxuICAgICAgICBpZiAoQ0NfSlNCKSB7XG4gICAgICAgICAgICBsYW5ndWFnZUNvZGUgPSBfX2dldEN1cnJlbnRMYW5ndWFnZUNvZGUoKTtcbiAgICAgICAgfVxuICAgICAgICBzeXMubGFuZ3VhZ2VDb2RlID0gbGFuZ3VhZ2VDb2RlID8gbGFuZ3VhZ2VDb2RlLnRvTG93ZXJDYXNlKCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIHN5cy5vc1ZlcnNpb24gPSBfX2dldE9TVmVyc2lvbigpO1xuICAgICAgICBzeXMub3NNYWluVmVyc2lvbiA9IHBhcnNlSW50KHN5cy5vc1ZlcnNpb24pO1xuICAgICAgICBzeXMuYnJvd3NlclR5cGUgPSBudWxsO1xuICAgICAgICBzeXMuYnJvd3NlclZlcnNpb24gPSBudWxsO1xuXG4gICAgICAgIHZhciB3ID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIHZhciBoID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICB2YXIgcmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuICAgICAgICBzeXMud2luZG93UGl4ZWxSZXNvbHV0aW9uID0ge1xuICAgICAgICAgICAgd2lkdGg6IHJhdGlvICogdyxcbiAgICAgICAgICAgIGhlaWdodDogcmF0aW8gKiBoXG4gICAgICAgIH07XG5cbiAgICAgICAgc3lzLmxvY2FsU3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG5cbiAgICAgICAgdmFyIGNhcGFiaWxpdGllcztcbiAgICAgICAgY2FwYWJpbGl0aWVzID0gc3lzLmNhcGFiaWxpdGllcyA9IHtcbiAgICAgICAgICAgIFwiY2FudmFzXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJvcGVuZ2xcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwid2VicFwiOiB0cnVlLFxuICAgICAgICB9O1xuXG4gICAgICAgaWYgKHN5cy5pc01vYmlsZSkge1xuICAgICAgICAgICAgY2FwYWJpbGl0aWVzW1wiYWNjZWxlcm9tZXRlclwiXSA9IHRydWU7XG4gICAgICAgICAgICBjYXBhYmlsaXRpZXNbXCJ0b3VjaGVzXCJdID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRlc2t0b3BcbiAgICAgICAgICAgIGNhcGFiaWxpdGllc1tcImtleWJvYXJkXCJdID0gdHJ1ZTtcbiAgICAgICAgICAgIGNhcGFiaWxpdGllc1tcIm1vdXNlXCJdID0gdHJ1ZTtcbiAgICAgICAgICAgIGNhcGFiaWxpdGllc1tcInRvdWNoZXNcIl0gPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN5cy5fX2F1ZGlvU3VwcG9ydCA9IHtcbiAgICAgICAgICAgIE9OTFlfT05FOiBmYWxzZSxcbiAgICAgICAgICAgIFdFQl9BVURJTzogZmFsc2UsXG4gICAgICAgICAgICBERUxBWV9DUkVBVEVfQ1RYOiBmYWxzZSxcbiAgICAgICAgICAgIGZvcm1hdDogWycubXAzJ11cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGJyb3dzZXIgb3IgcnVudGltZVxuICAgICAgICB2YXIgd2luID0gd2luZG93LCBuYXYgPSB3aW4ubmF2aWdhdG9yLCBkb2MgPSBkb2N1bWVudCwgZG9jRWxlID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgdmFyIHVhID0gbmF2LnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHN5cy5pc01vYmlsZSA9IGZhbHNlO1xuICAgICAgICAgICAgc3lzLnBsYXRmb3JtID0gc3lzLkVESVRPUl9QQUdFO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJbmRpY2F0ZSB3aGV0aGVyIHN5c3RlbSBpcyBtb2JpbGUgc3lzdGVtXG4gICAgICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHN5cy5pc01vYmlsZSA9IC9tb2JpbGV8YW5kcm9pZHxpcGhvbmV8aXBhZC8udGVzdCh1YSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW5kaWNhdGUgdGhlIHJ1bm5pbmcgcGxhdGZvcm1cbiAgICAgICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBwbGF0Zm9ybVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodHlwZW9mIEZiUGxheWFibGVBZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHN5cy5wbGF0Zm9ybSA9IHN5cy5GQl9QTEFZQUJMRV9BRFM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzeXMucGxhdGZvcm0gPSBzeXMuaXNNb2JpbGUgPyBzeXMuTU9CSUxFX0JST1dTRVIgOiBzeXMuREVTS1RPUF9CUk9XU0VSO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGN1cnJMYW5ndWFnZSA9IG5hdi5sYW5ndWFnZTtcbiAgICAgICAgY3Vyckxhbmd1YWdlID0gY3Vyckxhbmd1YWdlID8gY3Vyckxhbmd1YWdlIDogbmF2LmJyb3dzZXJMYW5ndWFnZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IGN1cnJlbnQgbGFuZ3VhZ2UgaXNvIDYzOS0xIGNvZGUuXG4gICAgICAgICAqIEV4YW1wbGVzIG9mIHZhbGlkIGxhbmd1YWdlIGNvZGVzIGluY2x1ZGUgXCJ6aC10d1wiLCBcImVuXCIsIFwiZW4tdXNcIiwgXCJmclwiLCBcImZyLWZyXCIsIFwiZXMtZXNcIiwgZXRjLlxuICAgICAgICAgKiBUaGUgYWN0dWFsIHZhbHVlIHRvdGFsbHkgZGVwZW5kcyBvbiByZXN1bHRzIHByb3ZpZGVkIGJ5IGRlc3RpbmF0aW9uIHBsYXRmb3JtLlxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gbGFuZ3VhZ2VDb2RlXG4gICAgICAgICAqL1xuICAgICAgICBzeXMubGFuZ3VhZ2VDb2RlID0gY3Vyckxhbmd1YWdlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgY3Vyckxhbmd1YWdlID0gY3Vyckxhbmd1YWdlID8gY3Vyckxhbmd1YWdlLnNwbGl0KFwiLVwiKVswXSA6IHN5cy5MQU5HVUFHRV9FTkdMSVNIO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZSB0aGUgY3VycmVudCBsYW5ndWFnZSBvZiB0aGUgcnVubmluZyBzeXN0ZW1cbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGxhbmd1YWdlXG4gICAgICAgICAqL1xuICAgICAgICBzeXMubGFuZ3VhZ2UgPSBjdXJyTGFuZ3VhZ2U7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBvcyBvZiBzeXN0ZW1cbiAgICAgICAgdmFyIGlzQW5kcm9pZCA9IGZhbHNlLCBpT1MgPSBmYWxzZSwgb3NWZXJzaW9uID0gJycsIG9zTWFpblZlcnNpb24gPSAwO1xuICAgICAgICB2YXIgdWFSZXN1bHQgPSAvYW5kcm9pZCAoXFxkKyg/OlxcLlxcZCspKikvaS5leGVjKHVhKSB8fCAvYW5kcm9pZCAoXFxkKyg/OlxcLlxcZCspKikvaS5leGVjKG5hdi5wbGF0Zm9ybSk7XG4gICAgICAgIGlmICh1YVJlc3VsdCkge1xuICAgICAgICAgICAgaXNBbmRyb2lkID0gdHJ1ZTtcbiAgICAgICAgICAgIG9zVmVyc2lvbiA9IHVhUmVzdWx0WzFdIHx8ICcnO1xuICAgICAgICAgICAgb3NNYWluVmVyc2lvbiA9IHBhcnNlSW50KG9zVmVyc2lvbikgfHwgMDtcbiAgICAgICAgfVxuICAgICAgICB1YVJlc3VsdCA9IC8oaVBhZHxpUGhvbmV8aVBvZCkuKk9TICgoXFxkK18/KXsyLDN9KS9pLmV4ZWModWEpO1xuICAgICAgICBpZiAodWFSZXN1bHQpIHtcbiAgICAgICAgICAgIGlPUyA9IHRydWU7XG4gICAgICAgICAgICBvc1ZlcnNpb24gPSB1YVJlc3VsdFsyXSB8fCAnJztcbiAgICAgICAgICAgIG9zTWFpblZlcnNpb24gPSBwYXJzZUludChvc1ZlcnNpb24pIHx8IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVmZXIgdG8gaHR0cHM6Ly9naXRodWIuY29tL2NvY29zLWNyZWF0b3IvZW5naW5lL3B1bGwvNTU0MiAsIHRoYW5rcyBmb3IgY29udHJpYml0aW9uIGZyb20gQGtyYXBuaWtra1xuICAgICAgICAvLyBpcGFkIE9TIDEzIHNhZmFyaSBpZGVudGlmaWVzIGl0c2VsZiBhcyBcIk1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1KSBBcHBsZVdlYktpdC82MDUuMS4xNSAoS0hUTUwsIGxpa2UgR2Vja28pXCIgXG4gICAgICAgIC8vIHNvIHVzZSBtYXhUb3VjaFBvaW50cyB0byBjaGVjayB3aGV0aGVyIGl0J3MgZGVza3RvcCBzYWZhcmkgb3Igbm90LiBcbiAgICAgICAgLy8gcmVmZXJlbmNlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81ODAxOTQ2My9ob3ctdG8tZGV0ZWN0LWRldmljZS1uYW1lLWluLXNhZmFyaS1vbi1pb3MtMTMtd2hpbGUtaXQtZG9lc250LXNob3ctdGhlLWNvcnJlY3RcbiAgICAgICAgLy8gRklYTUU6IHNob3VsZCByZW1vdmUgaXQgd2hlbiB0b3VjaC1lbmFibGVkIG1hY3MgYXJlIGF2YWlsYWJsZVxuICAgICAgICBlbHNlIGlmICgvKGlQaG9uZXxpUGFkfGlQb2QpLy5leGVjKG5hdi5wbGF0Zm9ybSkgfHwgKG5hdi5wbGF0Zm9ybSA9PT0gJ01hY0ludGVsJyAmJiBuYXYubWF4VG91Y2hQb2ludHMgJiYgbmF2Lm1heFRvdWNoUG9pbnRzID4gMSkpIHsgXG4gICAgICAgICAgICBpT1MgPSB0cnVlO1xuICAgICAgICAgICAgb3NWZXJzaW9uID0gJyc7XG4gICAgICAgICAgICBvc01haW5WZXJzaW9uID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvc05hbWUgPSBzeXMuT1NfVU5LTk9XTjtcbiAgICAgICAgaWYgKG5hdi5hcHBWZXJzaW9uLmluZGV4T2YoXCJXaW5cIikgIT09IC0xKSBvc05hbWUgPSBzeXMuT1NfV0lORE9XUztcbiAgICAgICAgZWxzZSBpZiAoaU9TKSBvc05hbWUgPSBzeXMuT1NfSU9TO1xuICAgICAgICBlbHNlIGlmIChuYXYuYXBwVmVyc2lvbi5pbmRleE9mKFwiTWFjXCIpICE9PSAtMSkgb3NOYW1lID0gc3lzLk9TX09TWDtcbiAgICAgICAgZWxzZSBpZiAobmF2LmFwcFZlcnNpb24uaW5kZXhPZihcIlgxMVwiKSAhPT0gLTEgJiYgbmF2LmFwcFZlcnNpb24uaW5kZXhPZihcIkxpbnV4XCIpID09PSAtMSkgb3NOYW1lID0gc3lzLk9TX1VOSVg7XG4gICAgICAgIGVsc2UgaWYgKGlzQW5kcm9pZCkgb3NOYW1lID0gc3lzLk9TX0FORFJPSUQ7XG4gICAgICAgIGVsc2UgaWYgKG5hdi5hcHBWZXJzaW9uLmluZGV4T2YoXCJMaW51eFwiKSAhPT0gLTEgfHwgdWEuaW5kZXhPZihcInVidW50dVwiKSAhPT0gLTEpIG9zTmFtZSA9IHN5cy5PU19MSU5VWDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5kaWNhdGUgdGhlIHJ1bm5pbmcgb3MgbmFtZVxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3NcbiAgICAgICAgICovXG4gICAgICAgIHN5cy5vcyA9IG9zTmFtZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZGljYXRlIHRoZSBydW5uaW5nIG9zIHZlcnNpb25cbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IG9zVmVyc2lvblxuICAgICAgICAgKi9cbiAgICAgICAgc3lzLm9zVmVyc2lvbiA9IG9zVmVyc2lvbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZGljYXRlIHRoZSBydW5uaW5nIG9zIG1haW4gdmVyc2lvblxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gb3NNYWluVmVyc2lvblxuICAgICAgICAgKi9cbiAgICAgICAgc3lzLm9zTWFpblZlcnNpb24gPSBvc01haW5WZXJzaW9uO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZSB0aGUgcnVubmluZyBicm93c2VyIHR5cGVcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGJyb3dzZXJUeXBlXG4gICAgICAgICAqL1xuICAgICAgICBzeXMuYnJvd3NlclR5cGUgPSBzeXMuQlJPV1NFUl9UWVBFX1VOS05PV047XG4gICAgICAgIC8qIERldGVybWluZSB0aGUgYnJvd3NlciB0eXBlICovXG4gICAgICAgIChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHR5cGVSZWcxID0gL21xcWJyb3dzZXJ8bWljcm9tZXNzZW5nZXJ8cXFicm93c2VyfHNvZ291fHF6b25lfGxpZWJhb3xtYXh0aG9ufHVjYnN8MzYwIGFwaG9uZXwzNjBicm93c2VyfGJhaWR1Ym94YXBwfGJhaWR1YnJvd3NlcnxtYXh0aG9ufG14YnJvd3NlcnxtaXVpYnJvd3Nlci9pO1xuICAgICAgICAgICAgdmFyIHR5cGVSZWcyID0gL3FxfHVjYnJvd3Nlcnx1YnJvd3NlcnxlZGdlL2k7XG4gICAgICAgICAgICB2YXIgdHlwZVJlZzMgPSAvY2hyb21lfHNhZmFyaXxmaXJlZm94fHRyaWRlbnR8b3BlcmF8b3ByXFwvfG91cGVuZy9pO1xuICAgICAgICAgICAgdmFyIGJyb3dzZXJUeXBlcyA9IHR5cGVSZWcxLmV4ZWModWEpIHx8IHR5cGVSZWcyLmV4ZWModWEpIHx8IHR5cGVSZWczLmV4ZWModWEpO1xuXG4gICAgICAgICAgICB2YXIgYnJvd3NlclR5cGUgPSBicm93c2VyVHlwZXMgPyBicm93c2VyVHlwZXNbMF0udG9Mb3dlckNhc2UoKSA6IHN5cy5CUk9XU0VSX1RZUEVfVU5LTk9XTjtcblxuICAgICAgICAgICAgaWYgKGJyb3dzZXJUeXBlID09PSBcInNhZmFyaVwiICYmIGlzQW5kcm9pZClcbiAgICAgICAgICAgICAgICBicm93c2VyVHlwZSA9IHN5cy5CUk9XU0VSX1RZUEVfQU5EUk9JRDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGJyb3dzZXJUeXBlID09PSBcInFxXCIgJiYgdWEubWF0Y2goL2FuZHJvaWQuKmFwcGxld2Via2l0L2kpKVxuICAgICAgICAgICAgICAgIGJyb3dzZXJUeXBlID0gc3lzLkJST1dTRVJfVFlQRV9BTkRST0lEO1xuICAgICAgICAgICAgbGV0IHR5cGVNYXAgPSB7XG4gICAgICAgICAgICAgICAgJ21pY3JvbWVzc2VuZ2VyJzogc3lzLkJST1dTRVJfVFlQRV9XRUNIQVQsXG4gICAgICAgICAgICAgICAgJ3RyaWRlbnQnOiBzeXMuQlJPV1NFUl9UWVBFX0lFLFxuICAgICAgICAgICAgICAgICdlZGdlJzogc3lzLkJST1dTRVJfVFlQRV9FREdFLFxuICAgICAgICAgICAgICAgICczNjAgYXBob25lJzogc3lzLkJST1dTRVJfVFlQRV8zNjAsXG4gICAgICAgICAgICAgICAgJ214YnJvd3Nlcic6IHN5cy5CUk9XU0VSX1RZUEVfTUFYVEhPTixcbiAgICAgICAgICAgICAgICAnb3ByLyc6IHN5cy5CUk9XU0VSX1RZUEVfT1BFUkEsXG4gICAgICAgICAgICAgICAgJ3Vicm93c2VyJzogc3lzLkJST1dTRVJfVFlQRV9VQ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc3lzLmJyb3dzZXJUeXBlID0gdHlwZU1hcFticm93c2VyVHlwZV0gfHwgYnJvd3NlclR5cGU7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZGljYXRlIHRoZSBydW5uaW5nIGJyb3dzZXIgdmVyc2lvblxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gYnJvd3NlclZlcnNpb25cbiAgICAgICAgICovXG4gICAgICAgIHN5cy5icm93c2VyVmVyc2lvbiA9IFwiXCI7XG4gICAgICAgIC8qIERldGVybWluZSB0aGUgYnJvd3NlciB2ZXJzaW9uIG51bWJlciAqL1xuICAgICAgICAoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB2ZXJzaW9uUmVnMSA9IC8obXFxYnJvd3NlcnxtaWNyb21lc3NlbmdlcnxxcWJyb3dzZXJ8c29nb3V8cXpvbmV8bGllYmFvfG1heHRob258dWN8dWNic3wzNjAgYXBob25lfDM2MHxiYWlkdWJveGFwcHxiYWlkdXxtYXh0aG9ufG14YnJvd3NlcnxtaXVpKD86Lmh5YnJpZCk/KShtb2JpbGUpPyhicm93c2VyKT9cXC8/KFtcXGQuXSspL2k7XG4gICAgICAgICAgICB2YXIgdmVyc2lvblJlZzIgPSAvKHFxfGNocm9tZXxzYWZhcml8ZmlyZWZveHx0cmlkZW50fG9wZXJhfG9wclxcL3xvdXBlbmcpKG1vYmlsZSk/KGJyb3dzZXIpP1xcLz8oW1xcZC5dKykvaTtcbiAgICAgICAgICAgIHZhciB0bXAgPSB1YS5tYXRjaCh2ZXJzaW9uUmVnMSk7XG4gICAgICAgICAgICBpZighdG1wKSB0bXAgPSB1YS5tYXRjaCh2ZXJzaW9uUmVnMik7XG4gICAgICAgICAgICBzeXMuYnJvd3NlclZlcnNpb24gPSB0bXAgPyB0bXBbNF0gOiBcIlwiO1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIHZhciB3ID0gd2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICB2YXIgaCA9IHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICB2YXIgcmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbmRpY2F0ZSB0aGUgcmVhbCBwaXhlbCByZXNvbHV0aW9uIG9mIHRoZSB3aG9sZSBnYW1lIHdpbmRvd1xuICAgICAgICAgKiBAcHJvcGVydHkge1NpemV9IHdpbmRvd1BpeGVsUmVzb2x1dGlvblxuICAgICAgICAgKi9cbiAgICAgICAgc3lzLndpbmRvd1BpeGVsUmVzb2x1dGlvbiA9IHtcbiAgICAgICAgICAgIHdpZHRoOiByYXRpbyAqIHcsXG4gICAgICAgICAgICBoZWlnaHQ6IHJhdGlvICogaFxuICAgICAgICB9O1xuXG4gICAgICAgIHN5cy5fY2hlY2tXZWJHTFJlbmRlck1vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY2MuZ2FtZS5yZW5kZXJUeXBlICE9PSBjYy5nYW1lLlJFTkRFUl9UWVBFX1dFQkdMKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgZmVhdHVyZSBzdXBwb3J0cyBXZWJHTCByZW5kZXIgbW9kZSBvbmx5LlwiKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX3RtcENhbnZhczEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuXG4gICAgICAgIHZhciBjcmVhdGUzRENvbnRleHQgPSBmdW5jdGlvbiAoY2FudmFzLCBvcHRfYXR0cmlicywgb3B0X2NvbnRleHRUeXBlKSB7XG4gICAgICAgICAgICBpZiAob3B0X2NvbnRleHRUeXBlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbnZhcy5nZXRDb250ZXh0KG9wdF9jb250ZXh0VHlwZSwgb3B0X2F0dHJpYnMpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZTNEQ29udGV4dChjYW52YXMsIG9wdF9hdHRyaWJzLCBcIndlYmdsXCIpIHx8XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTNEQ29udGV4dChjYW52YXMsIG9wdF9hdHRyaWJzLCBcImV4cGVyaW1lbnRhbC13ZWJnbFwiKSB8fFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGUzRENvbnRleHQoY2FudmFzLCBvcHRfYXR0cmlicywgXCJ3ZWJraXQtM2RcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlM0RDb250ZXh0KGNhbnZhcywgb3B0X2F0dHJpYnMsIFwibW96LXdlYmdsXCIpIHx8XG4gICAgICAgICAgICAgICAgICAgIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNjLnN5cy5sb2NhbFN0b3JhZ2UgaXMgYSBsb2NhbCBzdG9yYWdlIGNvbXBvbmVudC5cbiAgICAgICAgICogQHByb3BlcnR5IHtPYmplY3R9IGxvY2FsU3RvcmFnZVxuICAgICAgICAgKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBsb2NhbFN0b3JhZ2UgPSBzeXMubG9jYWxTdG9yYWdlID0gd2luLmxvY2FsU3RvcmFnZTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic3RvcmFnZVwiLCBcIlwiKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwic3RvcmFnZVwiKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZSA9IG51bGw7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhciB3YXJuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCg1MjAwKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzeXMubG9jYWxTdG9yYWdlID0ge1xuICAgICAgICAgICAgICAgIGdldEl0ZW0gOiB3YXJuLFxuICAgICAgICAgICAgICAgIHNldEl0ZW0gOiB3YXJuLFxuICAgICAgICAgICAgICAgIHJlbW92ZUl0ZW0gOiB3YXJuLFxuICAgICAgICAgICAgICAgIGNsZWFyIDogd2FyblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfc3VwcG9ydFdlYnAgPSBfdG1wQ2FudmFzMS50b0RhdGFVUkwoJ2ltYWdlL3dlYnAnKS5zdGFydHNXaXRoKCdkYXRhOmltYWdlL3dlYnAnKTtcbiAgICAgICAgdmFyIF9zdXBwb3J0Q2FudmFzID0gISFfdG1wQ2FudmFzMS5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHZhciBfc3VwcG9ydFdlYkdMID0gZmFsc2U7XG4gICAgICAgIGlmIChDQ19URVNUKSB7XG4gICAgICAgICAgICBfc3VwcG9ydFdlYkdMID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAod2luLldlYkdMUmVuZGVyaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgX3N1cHBvcnRXZWJHTCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGNhcGFiaWxpdGllcyBvZiB0aGUgY3VycmVudCBwbGF0Zm9ybVxuICAgICAgICAgKiBAcHJvcGVydHkge09iamVjdH0gY2FwYWJpbGl0aWVzXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgY2FwYWJpbGl0aWVzID0gc3lzLmNhcGFiaWxpdGllcyA9IHtcbiAgICAgICAgICAgIFwiY2FudmFzXCI6IF9zdXBwb3J0Q2FudmFzLFxuICAgICAgICAgICAgXCJvcGVuZ2xcIjogX3N1cHBvcnRXZWJHTCxcbiAgICAgICAgICAgIFwid2VicFwiOiBfc3VwcG9ydFdlYnAsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChkb2NFbGVbJ29udG91Y2hzdGFydCddICE9PSB1bmRlZmluZWQgfHwgZG9jWydvbnRvdWNoc3RhcnQnXSAhPT0gdW5kZWZpbmVkIHx8IG5hdi5tc1BvaW50ZXJFbmFibGVkKVxuICAgICAgICAgICAgY2FwYWJpbGl0aWVzW1widG91Y2hlc1wiXSA9IHRydWU7XG4gICAgICAgIGlmIChkb2NFbGVbJ29ubW91c2V1cCddICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBjYXBhYmlsaXRpZXNbXCJtb3VzZVwiXSA9IHRydWU7XG4gICAgICAgIGlmIChkb2NFbGVbJ29ua2V5dXAnXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgY2FwYWJpbGl0aWVzW1wia2V5Ym9hcmRcIl0gPSB0cnVlO1xuICAgICAgICBpZiAod2luLkRldmljZU1vdGlvbkV2ZW50IHx8IHdpbi5EZXZpY2VPcmllbnRhdGlvbkV2ZW50KVxuICAgICAgICAgICAgY2FwYWJpbGl0aWVzW1wiYWNjZWxlcm9tZXRlclwiXSA9IHRydWU7XG5cbiAgICAgICAgaWYgKCFfc3VwcG9ydFdlYnApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB3ZWJQID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICB3ZWJQLm9ubG9hZCA9IHdlYlAub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAod2ViUC5oZWlnaHQgPT0gMilcbiAgICAgICAgICAgICAgICAgICAgY2FwYWJpbGl0aWVzW1wid2VicFwiXSA9IHRydWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgd2ViUC5zcmMgPSAnZGF0YTppbWFnZS93ZWJwO2Jhc2U2NCxVa2xHUmpvQUFBQlhSVUpRVmxBNElDNEFBQUN5QWdDZEFTb0NBQUlBTG1rMG1rMGlJaUlpSWdCb1N5Z0FCYzZXV2dBQS92ZWZmLzBQUDhiQS8vTHdZQUFBJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfX2F1ZGlvU3VwcG9ydDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQXVkaW8gc3VwcG9ydCBpbiB0aGUgYnJvd3NlclxuICAgICAgICAgKlxuICAgICAgICAgKiBNVUxUSV9DSEFOTkVMICAgICAgICA6IE11bHRpcGxlIGF1ZGlvIHdoaWxlIHBsYXlpbmcgLSBJZiBpdCBkb2Vzbid0LCB5b3UgY2FuIG9ubHkgcGxheSBiYWNrZ3JvdW5kIG11c2ljXG4gICAgICAgICAqIFdFQl9BVURJTyAgICAgICAgICAgIDogU3VwcG9ydCBmb3IgV2ViQXVkaW8gLSBTdXBwb3J0IFczQyBXZWJBdWRpbyBzdGFuZGFyZHMsIGFsbCBvZiB0aGUgYXVkaW8gY2FuIGJlIHBsYXllZFxuICAgICAgICAgKiBBVVRPUExBWSAgICAgICAgICAgICA6IFN1cHBvcnRzIGF1dG8tcGxheSBhdWRpbyAtIGlmIERvbuKAmHQgc3VwcG9ydCBpdCwgT24gYSB0b3VjaCBkZXRlY3RpbmcgYmFja2dyb3VuZCBtdXNpYyBjYW52YXMsIGFuZCB0aGVuIHJlcGxheVxuICAgICAgICAgKiBSRVBMQVlfQUZURVJfVE9VQ0ggICA6IFRoZSBmaXJzdCBtdXNpYyB3aWxsIGZhaWwsIG11c3QgYmUgcmVwbGF5IGFmdGVyIHRvdWNoc3RhcnRcbiAgICAgICAgICogVVNFX0VNUFRJRURfRVZFTlQgICAgOiBXaGV0aGVyIHRvIHVzZSB0aGUgZW1wdGllZCBldmVudCB0byByZXBsYWNlIGxvYWQgY2FsbGJhY2tcbiAgICAgICAgICogREVMQVlfQ1JFQVRFX0NUWCAgICAgOiBkZWxheSBjcmVhdGVkIHRoZSBjb250ZXh0IG9iamVjdCAtIG9ubHkgd2ViQXVkaW9cbiAgICAgICAgICogTkVFRF9NQU5VQUxfTE9PUCAgICAgOiBsb29wIGF0dHJpYnV0ZSBmYWlsdXJlLCBuZWVkIHRvIHBlcmZvcm0gbG9vcCBtYW51YWxseVxuICAgICAgICAgKlxuICAgICAgICAgKiBNYXkgYmUgbW9kaWZpY2F0aW9ucyBmb3IgYSBmZXcgYnJvd3NlciB2ZXJzaW9uXG4gICAgICAgICAqL1xuICAgICAgICAoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgdmFyIERFQlVHID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHZhciB2ZXJzaW9uID0gc3lzLmJyb3dzZXJWZXJzaW9uO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBicm93c2VyIHN1cHBvcnRzIFdlYiBBdWRpb1xuICAgICAgICAgICAgLy8gY2hlY2sgV2ViIEF1ZGlvJ3MgY29udGV4dFxuICAgICAgICAgICAgdmFyIHN1cHBvcnRXZWJBdWRpbyA9ICEhKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCB8fCB3aW5kb3cubW96QXVkaW9Db250ZXh0KTtcblxuICAgICAgICAgICAgX19hdWRpb1N1cHBvcnQgPSB7IE9OTFlfT05FOiBmYWxzZSwgV0VCX0FVRElPOiBzdXBwb3J0V2ViQXVkaW8sIERFTEFZX0NSRUFURV9DVFg6IGZhbHNlIH07XG5cbiAgICAgICAgICAgIGlmIChzeXMub3MgPT09IHN5cy5PU19JT1MpIHtcbiAgICAgICAgICAgICAgICAvLyBJT1Mgbm8gZXZlbnQgdGhhdCB1c2VkIHRvIHBhcnNlIGNvbXBsZXRlZCBjYWxsYmFja1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgdGltZSBpcyBub3QgY29tcGxldGUsIGNhbiBub3QgcGxheVxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgX19hdWRpb1N1cHBvcnQuVVNFX0xPQURFUl9FVkVOVCA9ICdsb2FkZWRtZXRhZGF0YSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzeXMuYnJvd3NlclR5cGUgPT09IHN5cy5CUk9XU0VSX1RZUEVfRklSRUZPWCkge1xuICAgICAgICAgICAgICAgIF9fYXVkaW9TdXBwb3J0LkRFTEFZX0NSRUFURV9DVFggPSB0cnVlO1xuICAgICAgICAgICAgICAgIF9fYXVkaW9TdXBwb3J0LlVTRV9MT0FERVJfRVZFTlQgPSAnY2FucGxheSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzeXMub3MgPT09IHN5cy5PU19BTkRST0lEKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5cy5icm93c2VyVHlwZSA9PT0gc3lzLkJST1dTRVJfVFlQRV9VQykge1xuICAgICAgICAgICAgICAgICAgICBfX2F1ZGlvU3VwcG9ydC5PTkVfU09VUkNFID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKERFQlVHKXtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygnYnJvd3NlIHR5cGU6ICcgKyBzeXMuYnJvd3NlclR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ2Jyb3dzZSB2ZXJzaW9uOiAnICsgdmVyc2lvbik7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygnTVVMVElfQ0hBTk5FTDogJyArIF9fYXVkaW9TdXBwb3J0Lk1VTFRJX0NIQU5ORUwpO1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2coJ1dFQl9BVURJTzogJyArIF9fYXVkaW9TdXBwb3J0LldFQl9BVURJTyk7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygnQVVUT1BMQVk6ICcgKyBfX2F1ZGlvU3VwcG9ydC5BVVRPUExBWSk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChfX2F1ZGlvU3VwcG9ydC5XRUJfQVVESU8pIHtcbiAgICAgICAgICAgICAgICBfX2F1ZGlvU3VwcG9ydC5jb250ZXh0ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQgfHwgd2luZG93Lm1vekF1ZGlvQ29udGV4dCkoKTtcbiAgICAgICAgICAgICAgICBpZihfX2F1ZGlvU3VwcG9ydC5ERUxBWV9DUkVBVEVfQ1RYKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgX19hdWRpb1N1cHBvcnQuY29udGV4dCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0IHx8IHdpbmRvdy5tb3pBdWRpb0NvbnRleHQpKCk7IH0sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgX19hdWRpb1N1cHBvcnQuV0VCX0FVRElPID0gZmFsc2U7XG4gICAgICAgICAgICBjYy5sb2dJRCg1MjAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmb3JtYXRTdXBwb3J0ID0gW107XG5cbiAgICAgICAgKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgYXVkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgICAgICAgICAgaWYoYXVkaW8uY2FuUGxheVR5cGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2dnID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKTtcbiAgICAgICAgICAgICAgICBpZiAob2dnKSBmb3JtYXRTdXBwb3J0LnB1c2goJy5vZ2cnKTtcbiAgICAgICAgICAgICAgICB2YXIgbXAzID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWcnKTtcbiAgICAgICAgICAgICAgICBpZiAobXAzKSBmb3JtYXRTdXBwb3J0LnB1c2goJy5tcDMnKTtcbiAgICAgICAgICAgICAgICB2YXIgd2F2ID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdjsgY29kZWNzPVwiMVwiJyk7XG4gICAgICAgICAgICAgICAgaWYgKHdhdikgZm9ybWF0U3VwcG9ydC5wdXNoKCcud2F2Jyk7XG4gICAgICAgICAgICAgICAgdmFyIG1wNCA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcDQnKTtcbiAgICAgICAgICAgICAgICBpZiAobXA0KSBmb3JtYXRTdXBwb3J0LnB1c2goJy5tcDQnKTtcbiAgICAgICAgICAgICAgICB2YXIgbTRhID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL3gtbTRhJyk7XG4gICAgICAgICAgICAgICAgaWYgKG00YSkgZm9ybWF0U3VwcG9ydC5wdXNoKCcubTRhJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIF9fYXVkaW9TdXBwb3J0LmZvcm1hdCA9IGZvcm1hdFN1cHBvcnQ7XG5cbiAgICAgICAgc3lzLl9fYXVkaW9TdXBwb3J0ID0gX19hdWRpb1N1cHBvcnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIE5ldHdvcmsgdHlwZSBlbnVtZXJhdGlvblxuICAgICAqICEjemhcbiAgICAgKiDnvZHnu5znsbvlnovmnprkuL5cbiAgICAgKlxuICAgICAqIEBlbnVtIHN5cy5OZXR3b3JrVHlwZVxuICAgICAqL1xuICAgIHN5cy5OZXR3b3JrVHlwZSA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogTmV0d29yayBpcyB1bnJlYWNoYWJsZS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnvZHnu5zkuI3pgJpcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE5PTkVcbiAgICAgICAgICovXG4gICAgICAgIE5PTkU6IDAsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIE5ldHdvcmsgaXMgcmVhY2hhYmxlIHZpYSBXaUZpIG9yIGNhYmxlLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOmAmui/h+aXoOe6v+aIluiAheaciee6v+acrOWcsOe9kee7nOi/nuaOpeWboOeJuee9kVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTEFOXG4gICAgICAgICAqL1xuICAgICAgICBMQU46IDEsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIE5ldHdvcmsgaXMgcmVhY2hhYmxlIHZpYSBXaXJlbGVzcyBXaWRlIEFyZWEgTmV0d29ya1xuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOmAmui/h+icgueqneenu+WKqOe9kee7nOi/nuaOpeWboOeJuee9kVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gV1dBTlxuICAgICAgICAgKi9cbiAgICAgICAgV1dBTjogMlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3Mgc3lzXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSBuZXR3b3JrIHR5cGUgb2YgY3VycmVudCBkZXZpY2UsIHJldHVybiBjYy5zeXMuTmV0d29ya1R5cGUuTEFOIGlmIGZhaWx1cmUuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluW9k+WJjeiuvuWkh+eahOe9kee7nOexu+Weiywg5aaC5p6c572R57uc57G75Z6L5peg5rOV6I635Y+W77yM6buY6K6k5bCG6L+U5ZueIGNjLnN5cy5OZXR3b3JrVHlwZS5MQU5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0TmV0d29ya1R5cGVcbiAgICAgKiBAcmV0dXJuIHtOZXR3b3JrVHlwZX1cbiAgICAgKi9cbiAgICBzeXMuZ2V0TmV0d29ya1R5cGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gVE9ETzogbmVlZCB0byBpbXBsZW1lbnQgdGhpcyBmb3IgbW9iaWxlIHBob25lcy5cbiAgICAgICAgcmV0dXJuIHN5cy5OZXR3b3JrVHlwZS5MQU47XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIGJhdHRlcnkgbGV2ZWwgb2YgY3VycmVudCBkZXZpY2UsIHJldHVybiAxLjAgaWYgZmFpbHVyZS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5b2T5YmN6K6+5aSH55qE55S15rGg55S16YeP77yM5aaC5p6c55S16YeP5peg5rOV6I635Y+W77yM6buY6K6k5bCG6L+U5ZueIDFcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0QmF0dGVyeUxldmVsXG4gICAgICogQHJldHVybiB7TnVtYmVyfSAtIDAuMCB+IDEuMFxuICAgICAqL1xuICAgIHN5cy5nZXRCYXR0ZXJ5TGV2ZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gVE9ETzogbmVlZCB0byBpbXBsZW1lbnQgdGhpcyBmb3IgbW9iaWxlIHBob25lcy5cbiAgICAgICAgcmV0dXJuIDEuMDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRm9yY2VzIHRoZSBnYXJiYWdlIGNvbGxlY3Rpb24sIG9ubHkgYXZhaWxhYmxlIGluIEpTQlxuICAgICAqIEBtZXRob2QgZ2FyYmFnZUNvbGxlY3RcbiAgICAgKi9cbiAgICBzeXMuZ2FyYmFnZUNvbGxlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIE4vQSBpbiB3ZWJcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzdGFydCB0aGUgSlMgVk0sIG9ubHkgYXZhaWxhYmxlIGluIEpTQlxuICAgICAqIEBtZXRob2QgcmVzdGFydFZNXG4gICAgICovXG4gICAgc3lzLnJlc3RhcnRWTSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gTi9BIGluIHdlYlxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJuIHRoZSBzYWZlIGFyZWEgcmVjdC4gPGJyLz5cbiAgICAgKiBvbmx5IGF2YWlsYWJsZSBvbiB0aGUgaU9TIG5hdGl2ZSBwbGF0Zm9ybSwgb3RoZXJ3aXNlIGl0IHdpbGwgcmV0dXJuIGEgcmVjdCB3aXRoIGRlc2lnbiByZXNvbHV0aW9uIHNpemUuXG4gICAgICogISN6aFxuICAgICAqIOi/lOWbnuaJi+acuuWxj+W5leWuieWFqOWMuuWfn++8jOebruWJjeS7heWcqCBpT1Mg5Y6f55Sf5bmz5Y+w5pyJ5pWI44CC5YW25a6D5bmz5Y+w5bCG6buY6K6k6L+U5Zue6K6+6K6h5YiG6L6o546H5bC65a+444CCXG4gICAgICogQG1ldGhvZCBnZXRTYWZlQXJlYVJlY3RcbiAgICAgKiBAcmV0dXJuIHtSZWN0fVxuICAgICovXG4gICAgc3lzLmdldFNhZmVBcmVhUmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHZpc2libGVTaXplID0gY2Mudmlldy5nZXRWaXNpYmxlU2l6ZSgpO1xuICAgICAgICByZXR1cm4gY2MucmVjdCgwLCAwLCB2aXNpYmxlU2l6ZS53aWR0aCwgdmlzaWJsZVNpemUuaGVpZ2h0KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgd2hldGhlciBhbiBvYmplY3QgaXMgdmFsaWQsXG4gICAgICogSW4gd2ViIGVuZ2luZSwgaXQgd2lsbCByZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IGV4aXN0XG4gICAgICogSW4gbmF0aXZlIGVuZ2luZSwgaXQgd2lsbCByZXR1cm4gdHJ1ZSBpZiB0aGUgSlMgb2JqZWN0IGFuZCB0aGUgY29ycmVzcG9uZCBuYXRpdmUgb2JqZWN0IGFyZSBib3RoIHZhbGlkXG4gICAgICogQG1ldGhvZCBpc09iamVjdFZhbGlkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFZhbGlkaXR5IG9mIHRoZSBvYmplY3RcbiAgICAgKi9cbiAgICBzeXMuaXNPYmplY3RWYWxpZCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEdW1wIHN5c3RlbSBpbmZvcm1hdGlvbnNcbiAgICAgKiBAbWV0aG9kIGR1bXBcbiAgICAgKi9cbiAgICBzeXMuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgc3RyID0gXCJcIjtcbiAgICAgICAgc3RyICs9IFwiaXNNb2JpbGUgOiBcIiArIHNlbGYuaXNNb2JpbGUgKyBcIlxcclxcblwiO1xuICAgICAgICBzdHIgKz0gXCJsYW5ndWFnZSA6IFwiICsgc2VsZi5sYW5ndWFnZSArIFwiXFxyXFxuXCI7XG4gICAgICAgIHN0ciArPSBcImJyb3dzZXJUeXBlIDogXCIgKyBzZWxmLmJyb3dzZXJUeXBlICsgXCJcXHJcXG5cIjtcbiAgICAgICAgc3RyICs9IFwiYnJvd3NlclZlcnNpb24gOiBcIiArIHNlbGYuYnJvd3NlclZlcnNpb24gKyBcIlxcclxcblwiO1xuICAgICAgICBzdHIgKz0gXCJjYXBhYmlsaXRpZXMgOiBcIiArIEpTT04uc3RyaW5naWZ5KHNlbGYuY2FwYWJpbGl0aWVzKSArIFwiXFxyXFxuXCI7XG4gICAgICAgIHN0ciArPSBcIm9zIDogXCIgKyBzZWxmLm9zICsgXCJcXHJcXG5cIjtcbiAgICAgICAgc3RyICs9IFwib3NWZXJzaW9uIDogXCIgKyBzZWxmLm9zVmVyc2lvbiArIFwiXFxyXFxuXCI7XG4gICAgICAgIHN0ciArPSBcInBsYXRmb3JtIDogXCIgKyBzZWxmLnBsYXRmb3JtICsgXCJcXHJcXG5cIjtcbiAgICAgICAgc3RyICs9IFwiVXNpbmcgXCIgKyAoY2MuZ2FtZS5yZW5kZXJUeXBlID09PSBjYy5nYW1lLlJFTkRFUl9UWVBFX1dFQkdMID8gXCJXRUJHTFwiIDogXCJDQU5WQVNcIikgKyBcIiByZW5kZXJlci5cIiArIFwiXFxyXFxuXCI7XG4gICAgICAgIGNjLmxvZyhzdHIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBPcGVuIGEgdXJsIGluIGJyb3dzZXJcbiAgICAgKiBAbWV0aG9kIG9wZW5VUkxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gICAgICovXG4gICAgc3lzLm9wZW5VUkwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIGlmIChDQ19KU0IgfHwgQ0NfUlVOVElNRSkge1xuICAgICAgICAgICAganNiLm9wZW5VUkwodXJsKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGVsYXBzZWQgc2luY2UgMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDLlxuICAgICAqIEBtZXRob2Qgbm93XG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIHN5cy5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChEYXRlLm5vdykge1xuICAgICAgICAgICAgcmV0dXJuIERhdGUubm93KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKyhuZXcgRGF0ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHN5cztcbn1cblxudmFyIHN5cyA9IGNjICYmIGNjLnN5cyA/IGNjLnN5cyA6IGluaXRTeXMoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzeXM7XG4iXX0=