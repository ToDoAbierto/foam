/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

CLASS({
  package: 'com.google.ow.model',
  name: 'Envelope',
  extends: 'com.google.ow.model.StreamableTrait',
  traits: [
    'foam.core.dao.SyncTrait',
    'com.google.plus.ShareableTrait',
  ],

  //TODO: hack to get Envelope.SID to show up
  properties: [
    {
      name: 'id',
      lazyFactory: function() {
        return createGUID();
      },
    },
    {
      model_: 'BooleanProperty',
      name: 'promoted',
      defaultValue: false,
    },
    'sid',
    'shares',
    'owner',
    'source',
    'data',
    {
      model_: 'StringArrayProperty',
      name: 'substreams',
    },
  ],

  methods: [
    function toE(X) {
      return X.lookup('com.google.ow.ui.EnvelopeCitationView').create({
        data: this,
      }, X);
    },
    function toRowE(X) {
      return X.lookup('com.google.ow.ui.EnvelopeCitationView').create({
        data: this,
      }, X);
    },
    function toCitationE(X) {
      return X.lookup('com.google.ow.ui.EnvelopeCitationView').create({
        data: this,
      }, X);
    },
    function toDetailE(X) {
      return X.lookup('com.google.ow.ui.EnvelopeDetailView').create({
        data: this,
      }, X);
    },
  ],
});
