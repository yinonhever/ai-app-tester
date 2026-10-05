import type {
  AddNotification,
  RemoveNotification,
  Notification
} from "~/utils/types";
import uniqid from "uniqid";

export const useNotifications = () => {
  const notifications = ref<Notification[]>([]);
  const timeouts = reactive<Record<string, NodeJS.Timeout>>({});

  const addNotification: AddNotification = (content, icon) => {
    const id = uniqid();
    const newItem = { id, content, icon };
    notifications.value.push(newItem);
    timeouts[id] = setTimeout(() => removeNotification(id), 30000);
  };

  const removeNotification: RemoveNotification = id => {
    notifications.value = notifications.value.filter(item => item.id !== id);
    clearTimeout(timeouts[id]);
    delete timeouts[id];
  };

  provide("addNotification", addNotification);
  provide("removeNotification", removeNotification);

  return { notifications, addNotification, removeNotification };
};
