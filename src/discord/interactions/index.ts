import { handleCommandInteraction } from './commands';
import { handleSelectMenuInteraction } from './selectMenus';

const interactions = [handleCommandInteraction, handleSelectMenuInteraction];

export default interactions;
