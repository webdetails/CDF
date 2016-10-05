/*!
 * Copyright 2002 - 2016 Webdetails, a Pentaho company. All rights reserved.
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

requireCfg = {
  paths: {},
  shim: {},
  config: {}
};

var contextObj = {
  "locale": "en_US",
  "params": {},
  "path": "/test/fake_from_module_configuration.xcdf",
  "queryData": {},
  "roles": ["Administrator",
            "Authenticated"],
  "serverLocalDate": 1412605395782,
  "serverUTCDate": 1412601795782,
  "sessionAttributes": {},
  "sessionTimeout": 7200,
  "user": "admin"
};

var storageObj = {
  test: 1
};

var viewObj = {
  param: 1
};

requireCfg.config['cdf/dashboard/Dashboard'] = {
  context: contextObj,
  storage: storageObj,
  view: viewObj
};

var KARMA_RUN = true;

var SESSION_NAME = "dummy";
var SESSION_LOCALE = "en-US";
var CONTEXT_PATH = "/pentaho/";
