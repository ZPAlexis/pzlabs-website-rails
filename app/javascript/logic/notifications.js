import { Elements } from 'logic/uiElements';

export const NotificationManager = {
  notificationTime: 10000,

  //trigger notification:
  notify(notificationIndex) {
    this.setNotificationText(notificationIndex);
    this.openNotificationBox();
  },
  
  //set text: 
  setNotificationText(index) {
    const title = i18next.t(`notifications.notification-title-${index}`);
    const description = i18next.t(`notifications.notification-description-${index}`);
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