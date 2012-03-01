/**
 * Enhance recent changes diff links.
 * Author: Borislav Manolov
 * License: Public domain
 * Documentation: [[МедияУики:Gadget-Quick diff.js/doc]]
 */


if ( window.importScript && ! window.jQuery ) {
	importScript("МедияУики:Gadget-jQuery.js");
}

/**
 * @uses jQuery
 */
var QuickDiff = {

	enable: function()
	{
		jQuery('a[href*="diff="]').click(function(event){
			var $link = jQuery(this).addClass("working");
			var href = this.href + "&action=render"
				+ ( event.ctrlKey ? "" : "&diffonly=1" );
			jQuery.get(href, function(data){
				QuickDiff.viewDiff(data, $link);
				$link.removeClass("working").addClass("done");
			});
			return false;
		});
	},

	viewDiff: function(content, $link)
	{
		this.getViewWindow().css("top", $link.offset().top)
			.find("#quickdiff-content").html(content)
			.end().show();
		this.enableBunchPatroller($link);
	},

	viewWindow: null,

	getViewWindow: function()
	{
		if ( null === this.viewWindow ) {
			this.prepareViewWindow();
		}

		return this.viewWindow;
	},

	prepareViewWindow: function()
	{
		this.viewWindow = this.buildViewWindow();

		mw.loader.load("mediawiki.action.history.diff", "text/css");
		this.addCss();

		this.enableQuickPatroller();
	},

	buildViewWindow: function()
	{
		var $win = jQuery('<div id="quickdiff"><div id="quickdiff-close"/><div id="quickdiff-content"/></div>')
			.dblclick(function(){
				jQuery(this).hide();
			})
			.appendTo("#content");
		$win.find("#quickdiff-close").click(function(){
			$win.hide();
		});

		return $win;
	},

	addCss: function()
	{
		appendCSS(
			'#quickdiff {\
				position: absolute;\
				border: medium outset silver;\
				background-color: white;\
			}\
			#quickdiff-close {\
				position: absolute;\
				top: 0;\
				left: 0;\
				width: 30px;\
				height: 30px;\
				background: url(http://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Fileclose.png/32px-Fileclose.png) no-repeat center center;\
				cursor: pointer;\
			}'
		);
	},

	enableQuickPatroller: function()
	{
		if ( window.QuickPattroler ) QuickPattroler.enable();
	},

	enableBunchPatroller: function($link)
	{
		if ( window.BunchPatroller ) {
			WebRequest.setRequestUrl($link[0].href);
			BunchPatroller.enable();
		}
	}
};

// prepare for fight
addOnloadHook(function(){
	if ( /^(Recentchanges|Watchlist|Contributions)/.test(wgCanonicalSpecialPageName)
			|| "history" == wgAction
	) {
		QuickDiff.enable();
	}
});