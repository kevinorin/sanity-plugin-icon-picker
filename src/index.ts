import {definePlugin, Tool as SanityTool } from 'sanity';
import IconPicker from './main';

interface IconPicker {
  // add interface if you have the time
};

const plugin = {
  name: 'sanity-plugin-icon-picker',
  title: 'IconPicker'
};

const tool = {
  ...plugin,
  component: IconPicker
} as SanityTool;

export const iconPicker = definePlugin<IconPicker | void>((config = {}) => {
  return {
    name: 'sanity-plugin-icon-picker',
    tools: (prev) => {
      return [ ...prev, tool ]
    }
  }
})
