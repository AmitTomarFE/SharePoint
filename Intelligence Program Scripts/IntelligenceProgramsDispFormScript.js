jQuery(document).ready(function(){
	initDispForm();
});

function initDispForm() {
    var stoplightHtml = jQuery("a[name='SPBookmark_Stoplight']").parents("tr").find("#SPFieldCalculated").text();
    jQuery("a[name='SPBookmark_Stoplight']").parents("tr").find("#SPFieldCalculated").html(stoplightHtml);
    jQuery("a[name='SPBookmark_Stoplight']").parents("tr").find("#SPFieldCalculated div").css("text-align", "left");
    var name = jQuery("a[name='SPBookmark_Title']").parents("tr").eq(0).find("td").eq(1).text();
    jQuery("a[name='SPBookmark_Follow_x0020_this_x0020_link_x00']").parents("tr").eq(0).find("td").eq(1).find("a").html(name);
}