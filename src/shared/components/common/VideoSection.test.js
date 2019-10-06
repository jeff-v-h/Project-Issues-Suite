import React from 'react';
import VideoSection from './VideoSection';
import { shallow } from 'enzyme';

describe('<VideoSection />', () => {
  const mockFn = jest.fn();
  const wrapper = shallow(
    <VideoSection videos={[]} pathToNewVideo="url" redirectToVideo={mockFn} status="open" disabled={false} />);

  it('should have a header', () => {
    expect(wrapper.find('h2').text()).toEqual('Videos');
  });

  it('should have a semantic button', () => {
    expect(wrapper.find('Button').exists()).toBe(true);
  });

  it('should have no card when there are no videos', () => {
    expect(wrapper.find('VideoCard').exists()).toBe(false);
  });

  describe('When there are videos passed in', () => {
    const vids = [{ id: '123', title: 'name', description: 'short description', url: 'www.vidurl.com', length: '00:00:00' }];
    const wrapperWithVideos = shallow(
      <VideoSection videos={vids} pathname="url" redirectToVideo={mockFn} />);

    it('should have a VideoCard', () => {
      expect(wrapperWithVideos.find('VideoCard').exists()).toBe(true);
    });

    it('should have a working click function', () => {
      wrapperWithVideos.simulate('click');

      expect(mockFn).toHaveBeenCalled();
    });
  });
});
