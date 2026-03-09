import { Elements } from 'logic/uiElements';

export const NotificationManager = {
  notificationTime: 8000,

  //trigger notification:
  notify(notificationIndex) {
    this.setNotificationText(notificationIndex);
    this.openNotificationBox();
  },
  
  //set text: 
  setNotificationText(index) {
    const translations = JSON.parse(Elements.notificationTextContainer.dataset.translations);
    
    const title = translations[`notification_title_${index}`];
    const description = translations[`notification_description_${index}`];
    this.updateNotificationText(title, description);
  },

  updateNotificationText(title, description) {
    if (!Elements.notificationTitle || !Elements.notificationDescription) return;
    Elements.notificationTitle.innerHTML = title;
    Elements.notificationDescription.innerHTML = description;
  },

  //open:
  openNotificationBox() {
    if (!Elements.notificationBox) return;
    Elements.notificationBox.classList.remove('closed');
    setTimeout(this.closeNotificationBox, this.notificationTime);
  },
  
  //close:
  closeNotificationBox() {
    if (!Elements.notificationBox) return;
    Elements.notificationBox.classList.add('closed');
  }
}