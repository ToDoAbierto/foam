/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
CLASS({
  package: 'foam.u2.search',
  name: 'FilterController',
  extends: 'foam.u2.View',

  traits: [
    'foam.u2.md.MDViewOverridesTrait',
  ],

  requires: [
    'foam.u2.TextField',
    'foam.u2.md.Card',
    'foam.u2.md.Select',
    'foam.u2.md.TableView',
    'foam.u2.search.GroupBySearchView',
    'foam.u2.search.SearchMgr',
    'foam.u2.search.TextSearchView'
  ],

  imports: [
    'title$',
    'window'
  ],

  exports: [
    'as filterController',
  ],

  properties: [
    {
      name: 'count',
    },
    {
      name: 'totalCount',
    },
    {
      name: 'model',
      defaultValueFn: function() { return this.data.model; }
    },
    {
      name: 'data',
      required: true,
      postSet: function(old, nu) {
        if (nu) {
          nu.select(COUNT())(function(c) {
            this.totalCount = c.count;
          }.bind(this));
        }
      }
    },
    {
      type: 'foam.core.types.DAO',
      name: 'filteredDAO',
      required: true,
      toPropertyE: function(X) {
        return X.lookup('foam.u2.md.TableView').create({
          editColumnsEnabled: true,
        }, X);
      }
    },
    {
      name: 'filterChoice',
      label: 'New Filter',
    },
    {
      name: 'title',
    },
    {
      name: 'defaultFilter',
      documentation: 'Overridden by the specific subtypes.',
    },
    {
      name: 'searchMgr',
      lazyFactory: function() {
        return this.SearchMgr.create({
          dao$: this.data$,
          filteredDAO$: this.filteredDAO$,
        });
      }
    },
    {
      type: 'StringArray',
      name: 'searchFields',
      documentation: 'Property names that are currently selected as filters.',
      postSet: function(old, nu) {
        // Build up objects of the keys demanded by both sides, then add and
        // remove as needed.
        if (old) {
          for (var i = 0; i < old.length; i++) {
            if (!nu || nu.indexOf(old[i]) < 0) {
              this.searchMgr.remove(old[i]);
              this.searchViews[old[i]].remove();
              delete this.searchViews[old[i]];
            }
          }
        }

        if (nu) {
          for (var i = 0; i < nu.length; i++) {
            if (!old || old.indexOf(nu[i]) < 0) {
              var split = this.splitName(nu[i]);
              var prop = this.model.getFeature(split.name);
              var model = BooleanProperty.isInstance(prop) ?
                  this.GroupBySearchView : this.TextSearchView;
              var options = {
                floatingLabel: false,
                name: nu[i]
              };
              if (prop.tableSeparator) {
                options.split = prop.tableSeparator;
              }
              this.addGroup(model, prop, options);
              this.renderFilter(nu[i]);
            }
          }
        }
      }
    },
    {
      name: 'searchViews',
      factory: function() {
        return {};
      }
    },
    {
      name: 'subX',
      factory: function() {
        var Y = this.Y.sub();
        Y.registerModel(this.TextField.xbind({
          placeholder: '',
          floatingLabel: false
        }), 'foam.u2.TextField');
        return Y;
      }
    },
    {
      name: 'search',
      factory: function() {
        return this.searchMgr.add(this.TextSearchView.create({
          model: this.model,
          richSearch: true,
          keywordSearch: true
        }, this.subX));
      }
    },
    {
      name: 'filtersE_',
      factory: function() {
        return this.E('div').cls(this.myCls('filters'));
      }
    },
  ],

  methods: [
    function init() {
      this.SUPER();
      this.searchMgr.predicate$.addListener(this.onPredicateChange);
      this.filteredDAO$.addListener(this.onPredicateChange);
      this.onPredicateChange();
    },

    function addGroup(model, prop, opt_map) {
      var map = opt_map || {};
      map.property = prop;
      map.size = map.size || 1;

      var view = this.searchMgr.add(model.create(map, this.subX));

      var filterView = this.FilterView.create({
        key: view.name,
        prop: prop
      }).add(view);

      this.searchViews[view.name] = filterView;
      return filterView;
    },
    function renderFilter(key) {
      var card = this.Card.create({
        padding: false
      });
      card.add(this.searchViews[key]).style({ 'margin-bottom': '0' });
      this.filtersE_.add(card);
    },
    function addFilter_(name) {
      var highestCount = 0;
      for (var i = 0; i < this.searchFields.length; i++) {
        var split = this.splitName(this.searchFields[i]);
        if (split.count > highestCount) highestCount = split.count;
      }

      var key = name + (highestCount === 0 ? '' : '_' + (+highestCount + 1));
      this.searchFields = this.searchFields.pushF(key);
      return key;
    },
    function removeFilter(key) {
      // Need to count them up, looking for the right one.
      this.searchFields = this.searchFields.deleteF(key);
    },
    function splitName(key) {
      var match = key.match(/^(.*)_(\d+)$/);
      return match ? { name: match[1], count: match[2] } :
          { name: key, count: 1 };
    },
  ],

  listeners: [
    {
      name: 'onPredicateChange',
      isFramed: true,
      code: function() {
        this.filteredDAO.select(COUNT())(function(c) {
          this.count = c.count;
        }.bind(this));
      }
    },
  ],

  actions: [
    {
      name: 'clear',
      code: function() { this.searchMgr.clear(); }
    },
    {
      name: 'addFilter',
      code: function() {
        this.addFilter_(this.filterChoice);
      }
    },
  ],

  templates: [
    function CSS() {/*
      ^ {
        display: flex;
        flex-grow: 1;
        overflow: hidden;
        width: 100%;
      }

      ^search-panel {
        border-right: 1px solid #e0e0e0;
        color: #666;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        overflow: hidden;
        width: 320px;
      }
      ^filters {
        background-color: #e0e0e0;
        box-shadow: inset 0 6px 4px -4px rgba(0,0,0,0.18),
            inset 0 6px 3px -3px rgba(0,0,0,0.06);
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }

      ^adding {
        align-items: stretch;
        display: flex;
        flex-direction: column;
      }

      ^filter-area {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
      ^filters {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding-bottom: 10px;
      }

      ^add-filter {
        align-items: baseline;
        display: flex;
      }
      ^add-choice {
        flex-grow: 1;
      }
      ^count {
        align-items: baseline;
        display: flex;
        margin-left: 16px;
      }
      ^count-text {
        flex-grow: 1;
      }

      ^results {
        display: flex;
        flex-grow: 1;
      }
    */},

    // TODO(braden): Bring back the free-form search field. Needs style love.
    function initE() {/*#U2
      <div class="^" x:self={{this}}>
        <div class="^search-panel">
          <div class="^adding">
            <div class="^add-filter">
              <div class="^add-choice">
                {{ this.Select.create({ inline: true, data$: this.filterChoice$, choices: this.model.getRuntimeProperties().filter(function(prop) {
                  return !DateProperty.isInstance(prop) && !prop.hidden;
                }).map(function(prop) { return [prop.name, prop.label]; }) }) }}
              </div>
              <self:addFilter />
            </div>
            <div class="^count">
              <div class="^count-text">
                {{this.dynamic(function(c) { return c || '0';}, this.count$)}} of {{this.totalCount$}}&nbsp;{{this.dynamic(function(model) { return model.plural; }, this.model$)}}
              </div>
              <self:clear />
            </div>
          </div>

          <div class="^filter-area" as="filter_area">
            <!--
            <div class="^search">
              {{this.search}}
            </div>
            -->
            {{this.filtersE_}}
          </div>
        </div>
        <div class="^results">
          {{this.TableView.create({ data: this.filteredDAO$Proxy, editColumnsEnabled: true })}}
        </div>
      </div>

    */},
  ],

  models: [
    {
      name: 'FilterView',
      extends: 'foam.u2.Element',
      requires: [
        'foam.u2.md.ToolbarAction',
      ],
      imports: [
        'filterController',
      ],
      properties: [
        'prop',
        'key',
        'bodyE',
        ['overrideAdd_', true],
        {
          type: 'Array',
          name: 'addQueue_',
        },
      ],
      actions: [
        {
          name: 'removeFilter',
          label: 'close',
          ligature: 'close',
          code: function() {
            this.filterController.removeFilter(this.key);
          }
        },
      ],
      templates: [
        function CSS() {/*
          ^ {
            display: flex;
            flex-direction: column;
          }
          ^header {
            align-items: center;
            background-color: #DB4437;
            color: #fff;
            display: flex;
            flex-shrink: 0;
            font-size: 16px;
            font-weight: lighter;
            height: 48px;
            justify-content: space-between;
            padding: 0 0 0 12px;
          }
          ^header action-button {
            margin: 0;
          }
          ^label {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        */},
      ],
      methods: [
        function add() {
          if (this.overrideAdd_) {
            if (this.bodyE) this.bodyE.add.apply(this.bodyE, arguments);
            else this.addQueue_.push(Array.prototype.slice.call(arguments));
          } else {
            this.SUPER.apply(this, arguments);
          }
          return this;
        },
        function initE() {
          this.overrideAdd_ = false;

          this.cls(this.myCls()).cls(this.myCls('container'));
          this.start('div')
              .cls(this.myCls('header'))
              .start()
                  .cls(this.myCls('label'))
                  .add(this.prop.label)
                  .end()
                  .x({ data: this })
                  .add(this.REMOVE_FILTER)
                  .end();

          this.bodyE = this.start('div').cls(this.myCls('body'));
          for (var i = 0; i < this.addQueue_.length; i++) {
            this.bodyE.add.apply(this.bodyE, this.addQueue_[i]);
          }
          this.bodyE.end();

          this.overrideAdd_ = true;
        },
      ]
    }
  ]
});
