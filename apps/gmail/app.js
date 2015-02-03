var mgmail;

window.onload = function() {
  var Y = bootCORE(Application.create({
    name: 'MBug'
  }));

  aseq(
    arequire('Action'),
    arequire('Arg'),
    arequire('Method'),
    arequire('Interface'),
    arequire('Template'),
    arequire('Relationship'),
    arequire('Tooltip'),
    arequire('AutocompleteView'),
    arequire('WindowHashValue'),
    arequire('SwipeAltView'),
    arequire('VerticalScrollbarView'),
    arequire('ActionSheetView'),
    arequire('FloatingView'),
    arequire('StringEnumProperty'),
    arequire('EnumPropertyTrait'),
    arequire('ViewSlider'),
    arequire('OverlaySlider'),
    arequire('GridView'),
    arequire('ScrollView'),
    arequire('RelationshipView'),
    arequire('RelationshipsView'),
    arequire('LinkView'),
    arequire('Expr'),
    arequire('AbstractDAO'),
    arequire('StackView'),
    arequire('DAOController'),
    arequire('DAOCreateController'),
    arequire('OAuth2WebClient'),
    arequire('EMail'),
    arequire('EMailLabelProperty'),
    arequire('EMailMutationAction'),
    arequire('TextFieldView'),
    arequire('View'),
    arequire('foam.ui.md.AppController'),
    arequire('foam.ui.md.MonogramStringView'),
    arequire('GMailDraft'),
    arequire('GMailHistory'),
    arequire('GMailLabel'),
    arequire('FOAMGMailLabel'),
    arequire('GMailMessage'),
    arequire('GMailThread'),
    arequire('EMailView'),
    arequire('EMailComposeView'),
    arequire('EMailCitationView'),
    arequire('MenuView'),
    arequire('MenuLabelCitationView'),
    arequire('Window'),
    arequire('MGmail'),
    arequire('PositionedDOMViewTrait'),
    arequire('PositionedViewTrait'),
    arequire('TouchManager'),
    arequire('GestureManager'),
    arequire('ScrollGesture'),
    arequire('TapGesture'),
    arequire('DragGesture'),
    arequire('PinchTwistGesture'),
    arequire('OAuth2'),
    arequire('XHR'),
    arequire('LimitedLiveCachingDAO'),
    arequire('ProxyDAO'),
    arequire('GMailToEMailDAO'),
    arequire('AbstractAdapterDAO'),
    arequire('GMailMessageDAO'),
    arequire('GMailRestDAO'),
    arequire('RestDAO'),
    arequire('DelayDecorator'),
    arequire('OAuthXhrDecorator'),
    arequire('RetryDecorator'),
    arequire('NullDAO'),
    arequire('CachingDAO'),
    arequire('IDBDAO'),
    arequire('FutureDAO'),
    arequire('CountExpr'),
    arequire('FOAMGMailMessage'),
    arequire('GestureTarget'),
    arequire('DescExpr'),
    arequire('UNARY'),
    arequire('PopupChoiceView'),
    arequire('AbstractChoiceView'),
    arequire('AbstractDAOView'),
    arequire('DetailView'),
    arequire('ActionButtonCView'),
    arequire('foam.graphics.CView'),
    arequire('Circle2'),
    arequire('PropertyView'),
    arequire('CViewView'),
    arequire('EqExpr'),
    arequire('BINARY'),
    arequire('ConstantExpr'),
    arequire('PopupView'),
    arequire('UpdateDetailView'),
    arequire('DescribeExpr'),
    arequire('InExpr'),
    arequire('GtExpr'),
    arequire('GteExpr'),
    arequire('LtExpr'),
    arequire('LteExpr'),
    arequire('ScrollViewRow'),
    arequire('RelativeDateTimeFieldView'),
    arequire('DateTimeFieldView'),
    arequire('ImageBooleanView'))(function() {
      var w = Y.Window.create({ window: window });
      mgmail = Y.MGmail.create({});
      w.view = mgmail;
    });
};
