export const TabManager = {
  init() {
    const tabs = document.querySelectorAll('.js-tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetSelector = tab.getAttribute('data-tab-target');
        const groupName = tab.getAttribute('data-tab-group');
        
        this.switchTab(tab, targetSelector, groupName);

        console.log('Trying to switch tab')
      });
    });
  },

  switchTab(activeTab, targetSelector, groupName) {
    const groupTabs = document.querySelectorAll(`.js-tab[data-tab-group="${groupName}"]`);
    groupTabs.forEach(t => t.classList.remove('selected'));
    
    activeTab.classList.add('selected');

    const groupContents = document.querySelectorAll(`.js-tab-content[data-tab-group="${groupName}"]`);
    groupContents.forEach(content => content.classList.add('hidden'));

    const targetContent = document.querySelector(targetSelector);
    if (targetContent) {
      targetContent.classList.remove('hidden');
    }
  }
};