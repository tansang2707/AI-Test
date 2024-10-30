"use client";
"use strict";
exports.__esModule = true;
exports.DataTable = void 0;
var table_1 = require("@/components/ui/table");
var button_1 = require("@/components/ui/button");
var checkbox_1 = require("@/components/ui/checkbox");
var dialog_1 = require("@/components/ui/dialog");
var react_1 = require("react");
var CoinFormModal_1 = require("./CoinFormModal");
function DataTable(_a) {
    var data = _a.data, searchQuery = _a.searchQuery, selectedChain = _a.selectedChain, onUpdate = _a.onUpdate, isLoading = _a.isLoading;
    var _b = react_1.useState(null), editItem = _b[0], setEditItem = _b[1];
    var _c = react_1.useState(false), showDeleteConfirm = _c[0], setShowDeleteConfirm = _c[1];
    var _d = react_1.useState(null), itemToDelete = _d[0], setItemToDelete = _d[1];
    var handleDelete = function (id) {
        onUpdate(data.filter(function (item) { return item.id !== id; }));
        setShowDeleteConfirm(false);
        setItemToDelete(null);
    };
    var handleEdit = function (updatedItem) {
        onUpdate(data.map(function (item) { return item.id === updatedItem.id ? updatedItem : item; }));
        setEditItem(null);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "rounded-md border" },
            React.createElement(table_1.Table, null,
                React.createElement(table_1.TableHeader, null,
                    React.createElement(table_1.TableRow, null,
                        React.createElement(table_1.TableHead, null, "No"),
                        React.createElement(table_1.TableHead, null, "Symbol"),
                        React.createElement(table_1.TableHead, null, "Name"),
                        React.createElement(table_1.TableHead, null, "Image"),
                        React.createElement(table_1.TableHead, null, "Address"),
                        React.createElement(table_1.TableHead, null, "Chain"),
                        React.createElement(table_1.TableHead, null, "Status"),
                        React.createElement(table_1.TableHead, null, "Vault"),
                        React.createElement(table_1.TableHead, null, "Actions"))),
                React.createElement(table_1.TableBody, null, isLoading ? (React.createElement(table_1.TableRow, null,
                    React.createElement(table_1.TableCell, { colSpan: 9, className: "text-center py-4" }, "Loading..."))) : data.length === 0 ? (React.createElement(table_1.TableRow, null,
                    React.createElement(table_1.TableCell, { colSpan: 9, className: "text-center py-4" }, "No results found"))) : (data.map(function (item) { return (React.createElement(table_1.TableRow, { key: item.id },
                    React.createElement(table_1.TableCell, null, item.id),
                    React.createElement(table_1.TableCell, null, item.symbol),
                    React.createElement(table_1.TableCell, null, item.name),
                    React.createElement(table_1.TableCell, null,
                        React.createElement("img", { src: item.image, alt: item.name, className: "w-8 h-8 rounded-full object-cover" })),
                    React.createElement(table_1.TableCell, null, item.address),
                    React.createElement(table_1.TableCell, null, item.chain),
                    React.createElement(table_1.TableCell, null,
                        React.createElement("span", { className: "px-2 py-1 rounded-full bg-green-500/20 text-green-500" }, item.status)),
                    React.createElement(table_1.TableCell, null,
                        React.createElement(checkbox_1.Checkbox, { checked: item.vault })),
                    React.createElement(table_1.TableCell, null,
                        React.createElement("div", { className: "flex gap-2" },
                            React.createElement(button_1.Button, { variant: "outline", size: "sm", onClick: function () { return setEditItem(item); } }, "Edit"),
                            React.createElement(button_1.Button, { variant: "destructive", size: "sm", onClick: function () {
                                    setItemToDelete(item.id);
                                    setShowDeleteConfirm(true);
                                } }, "Delete"))))); }))))),
        editItem && (React.createElement(CoinFormModal_1.CoinFormModal, { open: !!editItem, onOpenChange: function () { return setEditItem(null); }, 
            //@ts-ignore
            onSave: handleEdit, item: editItem })),
        React.createElement(dialog_1.Dialog, { open: showDeleteConfirm, onOpenChange: setShowDeleteConfirm },
            React.createElement(dialog_1.DialogContent, null,
                React.createElement(dialog_1.DialogHeader, null,
                    React.createElement(dialog_1.DialogTitle, null, "Confirm Delete")),
                React.createElement("div", { className: "flex justify-end gap-2" },
                    React.createElement(button_1.Button, { variant: "outline", onClick: function () { return setShowDeleteConfirm(false); } }, "Cancel"),
                    React.createElement(button_1.Button, { variant: "destructive", onClick: function () { return itemToDelete && handleDelete(itemToDelete); } }, "Delete"))))));
}
exports.DataTable = DataTable;
