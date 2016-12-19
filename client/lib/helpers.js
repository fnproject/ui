import { eventBus } from '../client';



export const defaultErrorHander = function(jqXHR){
  var text = "Error " + jqXHR.status + '. Can not complete action';
  try {
    text = jqXHR.responseJSON.msg
  } catch (_err) {}
  eventBus.$emit('NotificationError', text);
}