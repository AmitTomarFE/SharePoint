jQuery("body").addClass("hideBody");
var IntelligencePrograms = IntelligencePrograms || {};
IntelligencePrograms.WebUrl = _spPageContextInfo.webAbsoluteUrl;
IntelligencePrograms.ListName = "Intelligence Programs";
IntelligencePrograms.AdminGroupName = "Program and Performance Operations Admins";
IntelligencePrograms.IsCurrentUserAdmin = false;

SPClientTemplates.TemplateManager.RegisterTemplateOverrides({
    Templates: {
        Fields: {
            //'Follow_x0020_this_x0020_link_x00': {
            //    'View': function (ctx) {                    
            //        return String.format('<a href="{0}" onclick="EditItem2(event, \'{0}\');return false;">{1}</a>', ctx.CurrentItem.Follow_x0020_this_x0020_link_x00, ctx.CurrentItem.Title);
            //    }
            //},
            'Explanation_x0020_of_x0020_chang': {
                'View': function (ctx) {
                    var url1 = IntelligencePrograms.WebUrl + "/Lists/" + IntelligencePrograms.ListName + "/DispForm.aspx?ID=" + ctx.CurrentItem.ID + "#SPBookmark_Explanation_x0020_of_x0020_chang";
                    return String.format("<a href='{0}'>View Entries...</a>",url1);
                }
            },
            'Explanation_x0020_of_x0020_chang0': {
                'View': function (ctx) {
                    var url2 = IntelligencePrograms.WebUrl + "/Lists/" + IntelligencePrograms.ListName + "/DispForm.aspx?ID=" + ctx.CurrentItem.ID + "#SPBookmark_Explanation_x0020_of_x0020_chang0";
                    return String.format("<a href='{0}'>View Entries...</a>", url2);
                }
            }
        }
    },
    OnPreRender: function () {        
        IntelligencePrograms.IsCurrentUserMemberOfGroup();
        
        if (IntelligencePrograms.IsCurrentUserAdmin)
            window.location.href = IntelligencePrograms.WebUrl + /lists/ + IntelligencePrograms.ListName + "/AllTasks.aspx";

        else {
            jQuery("body").removeClass("hideBody");
        }
    },
    OnPostRender: function () {
        jQuery(".ms-pivotControl-container > a").each(function (ind, obj) {
            if (jQuery(this).attr("aria-label").indexOf("All Documents, View") != -1) {
                jQuery(this).hide();
                return false;
            }
        });
        IntelligencePrograms.ShowUpdateColumn();
    }
});

jQuery(document).ready(function () {
    IntelligencePrograms.Init();
});


IntelligencePrograms.ShowUpdateColumn = function () {
   if (window.location.href.indexOf("ShowInGrid%3DTrue") != -1) {
       var hideInterval2 = setInterval(function () {
           if (jQuery("table.ms-listviewgrid > tbody > tr.ms-viewheadertr").length > 0) {
               jQuery("table.ms-listviewgrid > tbody > tr.ms-viewheadertr > th").each(function (index, obj) {
                   var thTitle = jQuery(this).attr("title");
                   
                   if (thTitle === "Number of changes to date for availability" || thTitle === "Number of changes to date for completion") {
                       jQuery(this).hide();
                       jQuery("table.ms-listviewgrid > tbody > tr:not(.ms-viewheadertr) td:nth-child(" + (parseInt(index) + 1) + ")").hide();
                   }
               });
               clearInterval(hideInterval2);
           }
       }, 50);
    }
}

IntelligencePrograms.Init = function () {
    ExecuteOrDelayUntilScriptLoaded(IntelligencePrograms.ShowContextRibbonSections, "sp.ribbon.js");
}

window.onhashchange = function () {    
    IntelligencePrograms.ShowContextRibbonSections();    
    IntelligencePrograms.ShowUpdateColumn();
    console.log("hashchanges");
};

IntelligencePrograms.IsCurrentUserMemberOfGroup = function () {
    jQuery.ajax({
        url: IntelligencePrograms.WebUrl + "/_api/web/CurrentUser?$select=ID",
        method: "get",
        async:false,
        headers: { "accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.Id > 0) {
                IntelligencePrograms.CurrentUserId = data.d.Id;
                jQuery.ajax({
                    url: IntelligencePrograms.WebUrl + "/_api/web/sitegroups/getByName('" + IntelligencePrograms.AdminGroupName + "')/users?$select=ID",
                    method: "get",
                    async: false,
                    headers: { "accept": "application/json; odata=verbose" },
                    success: function (usersData) {
                        if (usersData.d.results.length > 0) {
                            var users = usersData.d.results;
                            jQuery.each(users, function (index, user) {
                                if (user.Id === IntelligencePrograms.CurrentUserId) {
                                    IntelligencePrograms.IsCurrentUserAdmin = true;                                    
                                    return false;
                                }
                            });
                        }
                    },
                    error: function (error) {
                        IntelligencePrograms.IsCurrentUserAdmin = false;
                        console.log("error: " + JSON.stringify(error));
                    }
                });
            }
        },
        error: function (error) {
            console.log("error: " + json.stringify(error));
        }
    });
}

IntelligencePrograms.ShowContextRibbonSections = function () {
    var initInfo = {editable: true,isEditMode: false,allowWebPartAdder: false};

    SP.Ribbon.WebPartComponent.registerWithPageManager(initInfo);
    var wpcomp = SP.Ribbon.WebPartComponent.get_instance();

    if(wpcomp){
         var zc = document.getElementById("MSOZoneCell_WebPartWPQ2");
         wpcomp.selectWebPart(zc, true);
    }
}
