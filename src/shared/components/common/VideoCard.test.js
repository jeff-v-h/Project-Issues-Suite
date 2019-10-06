import React from 'react';
import VideoCard from './VideoCard';
import { shallow, mount } from 'enzyme';

describe('<VideoCard />', () => {
  const mockFn = jest.fn();
  const video = {
    title: "a title",
    thumbnail: ""
  };
  const component = <VideoCard video={video}
                        clickFunction={mockFn} />;
  const shallowWrapper = shallow(component);

  it('should have Image element for thumbnail', () => {
    expect(shallowWrapper.find('Image').exists()).toBe(true);
  });

  it('should have a semantic Card', () => {
    expect(shallowWrapper.find('Card').exists()).toBe(true);
  });

  it('should have a working click function for the card', () => {
    shallowWrapper.simulate('click');

    expect(mockFn).toHaveBeenCalled();
  });

  describe('when mounted', () => {
    it('should have a header with the title props passed in', () => {
      const wrapper = mount(component);

      expect(wrapper.find('.header').text()).toBe(video.title);
      wrapper.unmount();
    });

    it('should have a video prop', () => {
      const wrapper = mount(component);

      expect(wrapper.prop('video')).toBe(video);
      wrapper.unmount();
    });
  });
});
