app.componentModule.component('sidebar', {
    templateUrl: 'component/layout/sidebar.tpl.html',
    controller: sidebar,
    controllerAs: 'ctrl'
});

function sidebar(sidebarService, authService, eventService) {
    var context = this;
    context.toggle = sidebarService.getToggle();
    context.user = authService.getUserInfo();
    context.menuItems = sidebarService.getAuthMenu();
    eventService.on('toggleSidebar', function (data) {
        context.toggle = data;
    });
}



