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
  package: 'com.google.ow.ui',
  name: 'OrderCitationView',
  extends: 'foam.u2.View',

  requires: [
    'foam.u2.md.Select',
  ],
  imports: [
    'personDAO',
  ],
  exports: [ 'data' ],

  properties: [
    [ 'nodeName', 'ORDER-CITATION' ],
    {
      name: 'data',
      postSet: function(old, nu) {
        if ( old === nu ) return;
        // console.log('Data', nu.customer, nu.merchant);
        if ( nu && nu.customer !== this.X.envelope.owner )
          this.getPerson(nu.customer, this.customer$);
        if ( nu && nu.merchant !== this.X.envelope.owner )
          this.getPerson(nu.merchant, this.merchant$);
      },
    },
    {
      model_: 'foam.core.types.DAOProperty',
      name: 'items',
      factory: function() {
        return this.data ? this.data.items : [].dao;
      },
      onDAOUpdate: function() {
        var sink = [].sink;
        this.items.select(sink)(function() {
          this.itemsText = sink.map(this.itemToText.bind(this)).join(', ');
        }.bind(this));
      },
    },
    {
      model_: 'StringProperty',
      name: 'itemsText',
    },
    {
      name: 'customer',
    },
    {
      name: 'merchant',
    },
  ],

  methods: [
    function itemToText(item) {
      return (item.quantity > 1 ? item.quantity.toString() + ' ' : '') +
          item.summary;
    },
    function initE() {
      return this
          .add(function(customer) {
            if ( ! customer ) return '';
            return this.start('div').cls('md-grey')
                .add('Customer: ')
                .add(this.customer.displayName)
              .end();
          }.bind(this).on$(this.X, this.customer$))
          .add(function(merchant) {
            if ( ! merchant ) return '';
            return this.start('div').cls('md-grey')
                .add('Merchant: ')
                .add(this.merchant.displayName)
              .end();
          }.bind(this).on$(this.X, this.merchant$))
          .start('div').cls('md-grey').cls('items').add(this.itemsText$).end()
          .start('div').cls('md-body').add(this.data.TOTAL).end()
          .start('div').cls('md-body').add(this.data.METHOD_OF_PAYMENT).end()
          .start('div').cls('md-body').add(this.data.STATUS).end();
    },
    function getPerson(id, value) {
      this.personDAO.find(id, { put: function(o) { value.set(o); } });
    },
    function init() {
      // For *EnumProperty.toPropertyE().
      this.Y.registerModel(this.Select, 'foam.u2.Select');

      this.SUPER();
    },
  ],

  templates: [
    function CSS() {/*
      order-citation { display: block; }
      order-citation .items {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    */},
  ],
});
