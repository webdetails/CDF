/*!
 * Copyright 2002 - 2018 Webdetails, a Hitachi Vantara company. All rights reserved.
 *
 * This software was developed by Webdetails and is provided under the terms
 * of the Mozilla Public License, Version 2.0, or any later version. You may not use
 * this file except in compliance with the license. If you need a copy of the license,
 * please go to http://mozilla.org/MPL/2.0/. The Initial Developer is Webdetails.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. Please refer to
 * the license for the specific language governing your rights and limitations.
 */

/**
 * Configuration file for cdf pentaho
 */
(function() {

  /* globals ENVIRONMENT_CONFIG, CONTEXT_PATH, FULL_QUALIFIED_URL */

  var isDebug = typeof document === "undefined" || document.location.href.indexOf("debug=true") > 0;
  var isCdfPathDefined = typeof ENVIRONMENT_CONFIG !== "undefined" &&
                         typeof ENVIRONMENT_CONFIG.paths !== "undefined" &&
                         typeof ENVIRONMENT_CONFIG.paths["cdf"] !== "undefined";

  if (isCdfPathDefined) { // environment is configured, checking
    requireCfg.paths['cdf'] = ENVIRONMENT_CONFIG.paths["cdf"];

  } else if (typeof KARMA_RUN !== "undefined") { // unit tests
    requireCfg.paths['cdf'] = 'target/test-javascript/cdf';

  } else {
    var cdfResourcesPath = 'plugin/pentaho-cdf/api/resources/js' + (isDebug ? '' : '/compressed');

    if (typeof CONTEXT_PATH !== "undefined") { // production
      //if(!isDebug) { requireCfg.urlArgs = "ts=" + (new Date()).getTime(); } // enable cache buster
      requireCfg.paths['cdf'] = CONTEXT_PATH + cdfResourcesPath;

    } else if (typeof FULL_QUALIFIED_URL !== "undefined") { // embedded
      //if(!isDebug) { requireCfg.urlArgs = "ts=" + (new Date()).getTime(); } // enable cache buster
      requireCfg.paths['cdf'] = FULL_QUALIFIED_URL + cdfResourcesPath;

    } else { // build
      requireCfg.paths['cdf'] = "cdf";

    }
  }

  var requireInstInfo = requireCfg.config["pentaho/instanceInfo"] || (requireCfg.config["pentaho/instanceInfo"] = {});
  requireInstInfo["cdf/components/ccc/config/cdf.vizApi.conf"] = {type: "pentaho.config.spec.IRuleSet"};

})();
