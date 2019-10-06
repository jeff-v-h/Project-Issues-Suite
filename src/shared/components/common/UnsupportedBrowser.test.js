import React from 'react';
import UnsupportedBrowser from './UnsupportedBrowser';
import { shallow, render, mount } from 'enzyme';

describe('<UnsupportedBrowser />', () => {
  const shallowWrapper = shallow(<UnsupportedBrowser />);

  it('should have a semantic Message element with a negative prop', () => {
    expect(shallowWrapper.find('Message').exists()).toBe(true);
    expect(shallowWrapper.find('Message').props().negative).toBe(true);
  });

  describe('when mounted', () => {
    it('should have a header with Unsupported Browser title', () => {
      const renderWrapper = render(<UnsupportedBrowser />);
      expect(renderWrapper.find('.header').text()).toBe('Unsupported Browser');
    });

    it('should have a link for more info regaring session storage', () => {
      const wrapper = mount(<UnsupportedBrowser />);
      expect(wrapper.find('a').at(0).prop('href')).toBe('https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API');
      wrapper.unmount();
    });

    it('should have a link for more info regaring getRandomValues', () => {
      const wrapper = mount(<UnsupportedBrowser />);
      expect(wrapper.find('a').at(1).prop('href')).toBe('https://developer.mozilla.org/en-US/docs/Web/API/RandomSource/getRandomValues');
      wrapper.unmount();
    });
  });
});
