app.componentModule.component('sidebar', {
    templateUrl: 'component/layout/sidebar.tpl.html',
    controller: sidebar,
    controllerAs: 'ctrl'
});

function sidebar(sidebarService,authService) {
    var context = this;
    context.user = authService.getUserInfo();
    context.menuItems = sidebarService.getAuthMenu();
}


