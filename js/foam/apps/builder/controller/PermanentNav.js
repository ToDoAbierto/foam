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
  package: 'foam.apps.builder.controller',
  name: 'PermanentNav',
  extends: 'foam.ui.SimpleView',

  documentation: 'View for "permanent navigation style" apps list.',

  requires: [
    'foam.ui.md.SharedStyles',
    'foam.ui.DAOListView',
  ],

  properties: [
    [ 'tagName', 'permanent-nav' ],
    {
      model_: 'StringProperty',
      name: 'title',
      defaultValue: 'title',
    },
    {
      model_: 'IntProperty',
      name: 'titleHeight',
      defaultValue: 56,
    },
    {
      model_: 'IntProperty',
      name: 'minWidth',
      defaultValue: 400,
    },
    {
      model_: 'IntProperty',
      name: 'preferredWidth',
      defaultValue: 400,
    },
    {
      model_: 'IntProperty',
      name: 'maxWidth',
      defaultValue: 400,
      postSet: function(old, nu) {
        if ( this.$ ) this.$.style.maxWidth = nu + 'px';
      },
    },
    {
      model_: 'foam.core.types.DAOProperty',
      name: 'dao',
      lazyFactory: function() { return []; },
    },
    {
      model_: 'ViewFactoryProperty',
      name: 'listView',
      defaultValue: 'foam.ui.DAOListView'
    },
    {
      model_: 'ViewFactoryProperty',
      name: 'menuView',
      defaultValue: null,

    },
    {
      model_: 'ViewFactoryProperty',
      name: 'listView',
      defaultValue: 'foam.ui.DAOListView'
    },
  ],

  methods: [
    // TODO(markdittmer): Temporary while in an incomplete controller.
    function init() { this.SUPER(); this.SharedStyles.create(); },
  ],

  actions: [
    {
      name: 'menuAction',
      ligature: 'menu',
      code: function() {
        var menu = this.menuView();
        if ( menu.open ) menu.open();
      },
    },
  ],

  templates: [
    function toHTML() {/*
      <permanent-nav id="%%id" %%cssClassAttr() style="max-width: {{this.maxWidth}}px">
        <div id="%%id-title" class="nav-title-bar" style="height: {{this.titleHeight}}px">
          <div id="%%id-menu-button" class="nav-menu-button">
            <% if ( this.menuView ) { %>$$menuAction<% } %>
          </div>
          <span class="nav-title md-headline"><%# this.title %></span>
        </div>
        <div id="%%id-list" class="nav-list">
          <%= this.listView ? this.listView({ dao$: this.dao$ }) : '' %>
        </div>
      </permanent-nav>
    */},
    function CSS() {/*
      permanent-nav {
       display: flex;
       flex-direction: column;
      }
      permanent-nav .nav-title-bar {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #EEEEEE;
      }
      permanent-nav .nav-title-bar .nav-title {
        margin-left: 12px;
        flex-grow: 1;
      }
    */},

  ],
});