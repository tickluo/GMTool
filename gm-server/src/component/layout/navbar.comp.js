app.componentModule.component('navbar', {
    templateUrl: 'component/layout/navbar.tpl.html',
    controller: navCtrl,
    controllerAs: 'ctrl'
});

app.appModule
    .controller('DemoCtrl', [function () {
        this.isOpen = false;
        this.selectedMode = 'md-fling';
        this.selectedDirection = 'down';
    }]);


function navCtrl($mdSidenav, eventService,sidebarService) {
    var context = this;

    context.toggleSidebar = toggleSidebar;
    /*    context.isOpenSidebar = isOpenSidebar;
     function isOpenSidebar() {
     return $mdSidenav('sidebarLeft').isOpen();
     }*/

    function toggleSidebar() {
        /*$mdSidenav('sidebarLeft').toggle();*/
        sidebarService.toggleSidebar();
        eventService.trigger('toggleSidebar',sidebarService.getToggle() );
    }
}
