import React from 'react';
import PageHeader from './PageHeader';
import { shallow, mount } from 'enzyme';

describe('<PageHeader />', () => {
  const shallowWrapper = shallow(<PageHeader title="my title" isLoading />);

  it('should have a semantic header', () => {
    expect(shallowWrapper.find('Header').exists()).toBe(true);
  });

  it('should have a semantic divider', () => {
    expect(shallowWrapper.find('Divider').exists()).toBe(true);
  });

  it('should have a h1 title', () => {
    const wrapper = mount(<PageHeader title="my title" isLoading />);

    expect(wrapper.find('h1').text()).toBe('my title');
    wrapper.unmount();
  });

  it('should have an active loader when loading', () => {
    const wrapper = mount(<PageHeader title="my title" isLoading />);

    expect(wrapper.find('.loader').hasClass('active')).toBe(true);
    wrapper.unmount();
  });
});
