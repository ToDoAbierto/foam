/*
ID	Pri	M	Iteration	ReleaseBlock	Cr	Status	Owner	Summary	AllLabels	OS	Modified	ModifiedTimestamp
225563	1	27		Beta	Internals-Media-Video	Assigned	s...@chromium.org	Daisy - HTML5 and Flash video playback has out of order frames	Arch-ARM, Cr-Internals-Media-Video, M-27, Mstone-27, OS-Chrome, Pri-1, ReleaseBlock-Beta, Type-Bug-Regression	Chrome	Apr 09, 2013 20:24:39	1365539079
*/
var CIssue = FOAM.create({
    model_: 'Model',
    label: 'CIssue',
    name: 'CIssue',

   tableProperties:
   [
      'id',
      'priority',
      'milestone',
      'iteration',
      'releaseBlock',
      'category',
      'status',
      'owner',
      'summary',
      'OS',
      'modified'
   ],

    properties: [
        {
            name: 'id',
	    shortName: 'i',
            label: 'ID',
            type: 'Integer',
            required: true,
            tableWidth: '48px',
        },
        {
            name: 'priority',
	    shortName: 'p',
	    aliases: ['pr', 'pri', 'prior'],
            label: 'Pri',
            type: 'Integer',
            tableWidth: '35px',
            required: true
        },
        {
            name: 'milestone',
	    shortName: 'ms',
	    aliases: ['mstone'],
            label: 'M',
            type: 'Integer',
            tableWidth: '29px',
            defaultValue: ''
        },
        {
            name: 'iteration',
	    shortName: 'it',
	    aliases: ['iter'],
            label: 'Iteration',
            type: 'String',
            tableWidth: '69px',
        },
        {
            name: 'releaseBlock',
	    shortName: 'rb',
	    aliases: ['rBlock', 'release'],
            label: 'Release Block',
            type: 'String',
            tableWidth: '103px',
            defaultValue: ''
        },
        {
            name: 'category',
	    shortName: 'c',
	    aliases: ['cat', 'cr'],
            label: 'Cr',
            tableWidth: '87px',
            type: 'String',
            defaultValue: ''
        },
        {
            name: 'status',
	    shortName: 's',
	    aliases: ['stat'],
            label: 'Status',
            type: 'String',
            tableWidth: '58px',
            defaultValue: ''
        },
        {
            name: 'owner',
	    shortName: 'o',
            tableWidth: '181px',
            type: 'String'
        },
        {
            name: 'summary',
	    shortName: 'su',
            label: 'Summary + Labels',
            type: 'String',
            tableWidth: '100%',
            tableFormatter: function(value, row) {
              return value +
                CIssue.LABELS.tableFormatter(row.labels, row);
            },
        },
        {
            name: 'labels',
	    shortName: 'l',
	    aliases: ['label'],
            type: 'String',
	    tableFormatter: function(value, row) {
              var sb = [];
	      var a = value.split(',');
	      for ( var i = 0 ; i < a.length ; i++ ) {
	        sb.push(' <span class="label">');
		sb.push(a[i]);
		sb.push('</span>');
              }
	      return sb.join('');
            }
        },
        {
            name: 'OS',
            tableWidth: '61px',
            type: 'String'
        },
      {
         model_: 'Property',
         name: 'modified',
	 aliases: ['mod'],
	 shortName: 'm',
         label: 'Modified',
         type: 'Date',
         mode: 'read-write',
         required: true,
         displayWidth: 50,
         displayHeight: 1,
         view: 'TextFieldView',
         tableWidth: '100',
         preSet: function (d) {
           return typeof d === 'string' ? new Date(d) : d;
	 },
         tableFormatter: function(d) {
	   // TODO: put this somewhere reusable
           var now = new Date();
           var seconds = Math.floor((now - d)/1000);
           if (seconds < 60) return 'moments ago';
           var minutes = Math.floor((seconds)/60);
           if (minutes == 1) {
             return '1 minute ago';
           } else if (minutes < 60) {
             return minutes + ' minutes ago';
           } else {
             var hours = Math.floor(minutes/60);
             if (hours < 24) {
               return hours + ' hours ago';
             }
             var days = Math.floor(hours / 24);
             if (days < 7) {
               return days + ' days ago';
             } else if (days < 365) {
               var year = 1900+d.getYear();
               var noyear = d.toDateString().replace(" " + year, "")
               return /....(.*)/.exec(noyear)[1]
             }
           }
           return d.toDateString();
         },
         valueFactory: function() { return new Date(); }
      },
    ],

    methods: {
    }
});

CIssue.properties.forEach(function(p) {
    if (!p["tableFormatter"]) {
      p["tableFormatter"] = function(v) {
        if (('' + v).length) return v;
        return '----';
      };
    }
  });

var CIssueTileView = FOAM.create({
   model_: 'Model',

   extendsModel: 'AbstractView2',

   name: 'CIssueTileView',
   label: 'CIssue Tile View',

   properties: [
      {
	 name:  'issue',
	 label: 'Issue',
	 type:  'CIssue'
      }
   ],

   methods: {
     // Implement Sink
     put: function(issue) { this.issue = issue; },

     // Implement Adapter
     f: function(issue) { this.issue = issue; return this.toHTML(); }
   },

   templates:[
     {
        model_: 'Template',

        name: 'toHTML',
        description: 'TileView',
        template: '<div class="gridtile"><table cellspacing="0" cellpadding="0"><tbody><tr><td class="id"><img src="https://ssl.gstatic.com/codesite/ph/images/star_off.gif"><a href="../../chromium/issues/detail?id=<%= this.issue.id %>"><%= this.issue.id %></a></td><td class="status"><%= this.issue.status %></td></tr><tr><td colspan="2"><div><a href="../../chromium/issues/detail?id=<%= this.issue.id %>"><%= this.issue.summary %></a></div></td></tr></tbody></table></div>'
     }
   ]
});

/*
// Generate a Spreadsheet formula to convert exported CSV issues to JSON.

var ss = '=concatenate("{model_: \'CIssue\', \", ';

for ( var i = 0 ; i < CIssue.properties.length ; i++ ) {
  var p = CIssue.properties[i];
  if ( p.type === 'String' || p.type === 'Date' ) {
    ss = ss + '"' + p.name + ': ", "\'", ' + String.fromCharCode(65+i) + '2' + ', "\'"';
  } else {
    ss = ss + '"' + p.name + ': ", ' + String.fromCharCode(65+i) + '2';
  } 

  ss = ss + ', ", ", ';
}

ss = ss + '"}")';

console.log(ss);
*/

