app.componentModule.component('sidebar', {
    templateUrl: 'component/layout/sidebar.tpl.html',
    controller: sidebar,
    controllerAs: 'ctrl'
});

function sidebar(sidebarService,authService) {
    var context = this;
    context.user = authService.getUserInfo();
    sidebarService.then(function(res){
        context.menuItems = res;
    })
}


