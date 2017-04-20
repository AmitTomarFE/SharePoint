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
            'Update_x0020_priority': {
                'View': function (ctx) {                   
                    return String.format('<div class="priorityBtnWrapper"><i class="fa fa-sort-numeric-asc fa-lg priorityBtn" itemId="{0}" itemPriority={1} aria-hidden="true" style="cursor:pointer" onclick="IntelligencePrograms.UpdatePriority(this);return false;"></i><div>', ctx.CurrentItem.ID, ctx.CurrentItem.Priority);
                }
            },
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

        if (!IntelligencePrograms.IsCurrentUserAdmin)
            window.location.href = IntelligencePrograms.WebUrl + /lists/ + IntelligencePrograms.ListName + "/AllItems.aspx";
        
        else
            jQuery("body").removeClass("hideBody");
    },
    OnPostRender: function () {
        jQuery(".ms-pivotControl-container > a").each(function (ind, obj) {
            if (jQuery(this).attr("aria-label").indexOf("All Documents, View") != -1) {
                jQuery(this).html("All Items");
            }

            if (jQuery(this).attr("aria-label").indexOf("All Items, View") != -1) {
                jQuery(this).hide();
            }
        });

        IntelligencePrograms.ShowUpdateColumn();        
    }
});

jQuery(document).ready(function () {
    IntelligencePrograms.Init();
});

IntelligencePrograms.ShowUpdateColumn = function () {
    if (IntelligencePrograms.IsCurrentUserAdmin && window.location.href.indexOf("ShowInGrid%3DTrue") != -1) {    
        var hideInterval2 = setInterval(function () {
            if (jQuery("table.ms-listviewgrid > tbody > tr.ms-viewheadertr").length > 0) {
                jQuery("table.ms-listviewgrid > tbody > tr.ms-viewheadertr > th").each(function (index, obj) {
                    var thTitle = jQuery(this).attr("title");
                    if (thTitle === "Update") {
                        jQuery("table.ms-listviewgrid > tbody > tr:not(.ms-viewheadertr) td:nth-child(" + (parseInt(index) + 1) + ")").html("<div class='priorityBtnWrapper'><i class='fa fa-ban fa-lg' aria-hidden='true'></i></div>");
                    }

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

IntelligencePrograms.UpdatePriority = function (element) {
    jQuery("<table id='overlayPriority'><tbody><tr><td><div>Updating priorities, please wait ... </div></td></tr></tbody></table>").appendTo("body");
    var currentItemID = jQuery(element).attr("itemId");
    var currentItemPriority = jQuery(element).attr("itemPriority");
    IntelligencePrograms.IsFirstCall = true;
    IntelligencePrograms.AjaxCall(currentItemID, currentItemPriority);
}

IntelligencePrograms.AjaxCall = function (currentItemID, currentItemPriority) {
    jQuery.ajax({
        url: IntelligencePrograms.WebUrl + "/_api/web/lists/getbytitle('" + IntelligencePrograms.ListName + "')/items?$select=ID,Priority&$OrderBy=Priority",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results.length > 0) {
                IntelligencePrograms.Data = data.d.results;
                IntelligencePrograms.CheckDataForDuplicate(parseInt(currentItemID), parseInt(currentItemPriority));
            }
        },
        error: function (data) {
            console.log("Error: " + data);
        }
    });
}

IntelligencePrograms.CheckDataForDuplicate = function (currentItemID, currentItemPriority) {
    var duplicatePriorityExists = false;
    var duplicatePriorityItemID;
    var duplicateCounter = 0;

    jQuery.each(IntelligencePrograms.Data, function (index, obj) {
        if (obj.Priority == currentItemPriority && obj.ID != currentItemID) {
            ++duplicateCounter;
            duplicatePriorityItemID = obj.ID;
        }
    });

    if (duplicateCounter > 1) {
        var msgHtml = String.format("There are more than two items with priority {0}. Please correct priorities and try again.", currentItemPriority);
        SP.UI.ModalDialog.showModalDialog({ title: "Message", width: 600, height: 60, html: jQuery("<div>" + msgHtml + "</div>").get(0) });
        IntelligencePrograms.IsFirstCall = false;
        jQuery("#overlayPriority").remove();
    }
    else if (duplicateCounter == 1) {
        IntelligencePrograms.IsFirstCall = false;
        IntelligencePrograms.UpdateItem(duplicatePriorityItemID, parseInt(currentItemPriority + 1));
    }
    else {
        if (IntelligencePrograms.IsFirstCall) {
            var msgHtml2 = String.format("No other item found with same priority {0}.", currentItemPriority);
            SP.UI.ModalDialog.showModalDialog({ title: "Message", width: 600, height: 60, html: jQuery("<div>" + msgHtml2 + "</div>").get(0) });
            IntelligencePrograms.IsFirstCall = false;
            jQuery("#overlayPriority").remove();
        }
        else {
            location.reload();
        }
    }
}

IntelligencePrograms.UpdateItem = function (itemId, priority) {
    var clientContext = new SP.ClientContext(IntelligencePrograms.WebUrl);
    var oList = clientContext.get_web().get_lists().getByTitle(IntelligencePrograms.ListName);

    var item = oList.getItemById(itemId);
    item.set_item('Priority', priority);
    item.update();

    clientContext.executeQueryAsync(onQuerySucceeded, onQueryFailed);
    function onQuerySucceeded() {
        console.log('Items updated!');
        IntelligencePrograms.CheckDataForDuplicate(itemId, priority);
    }

    function onQueryFailed(sender, args) {
        console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
    }
}
