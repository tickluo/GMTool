app.serviceModule
    .factory('gridService', [
        function () {
            return {
                getGridColumns: function (columnDefs) {
                    /*columnDefs = _.filter(columnDefs || [], function (item) {
                        return item.visible !== false;
                    });

                    _(columnDefs || []).each(function (item) {
                        if (item.enableSorting !== true) {
                            item.enableSorting = false;
                        }
                    });*/
                    (columnDefs || []).forEach(function(item,context){
                        if (item.enableSorting !== true) {
                            item.enableSorting = false;
                        }
                    });

                    return columnDefs;
                },

                getGridOptions: function (gridOptions) {
                    var defaultOptions = {
                        enableGridMenu: true,
                        noUnselect: true,
                        enableRowHeaderSelection: false,
                        enableSorting: true,
                        enableColumnMenus: true,
                        multiSelect: false,
                        paginationPageSize: 20,
                        virtualizationThreshold: 20,
                        paginationPageSizes: [10, 20, 30, 40, 50],
                        minRowsToShow: 22,
                        useExternalPagination: true,
                        useExternalSorting: true,
                        columnDefs: []
                    };
                    var options = angular.extend({}, defaultOptions, gridOptions);
                    options.columnDefs = this.getGridColumns(options.columnDefs);
                    if (!options.gridMenuCustomItems) {
                        options.gridMenuCustomItems = [
                            {
                                title: '显示所有列',
                                action: function ($event) {
                                    this.grid.columns.forEach(function(){
                                        if (col.colDef.visible !== false) return;
                                        col.colDef.visible = true;
                                        col.grid.refresh();
                                        col.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                        col.grid.api.core.raise.columnVisibilityChanged(col);
                                    });
                                },
                                order: 210
                            }
                        ]
                    }
                    return options;
                }
            }
        }]);