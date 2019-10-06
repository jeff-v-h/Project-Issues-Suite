import React from 'react';
import DeleteModal from './DeleteModal';
import { shallow, mount } from 'enzyme';

describe('<DeleteModal />', () => {
  const mockShowFn = jest.fn();
  const mockCancelFn = jest.fn();
  const mockBtnFn = jest.fn();

  const shallowWrapper = shallow(
    <DeleteModal show
      btnFunction={mockBtnFn}
      inProgress={false}
      showModal={mockShowFn}
      hideModal={mockCancelFn}
      message="msg" />
  );

  it('should have a semantic Modal element', () => {
    expect(shallowWrapper.find('Modal').exists()).toBe(true);
  });

  it('should have a semantic Header', () => {
    expect(shallowWrapper.find('Header').exists()).toBe(true);
  });

  it('should have a message for the user', () => {
    expect(shallowWrapper.find('p').text()).toBe('msg');
  });

  it('should have a Button to confirm delete', () => {
    expect(shallowWrapper.find('Button').exists()).toBe(true);
  });

  it('should have a cancel button that calls the hideModal function', () => {
    shallowWrapper.find('Button').at(1).simulate('click');

    expect(mockCancelFn).toHaveBeenCalled();
  });

  describe('When mounted', () => {
    const wrapper = mount(
      <DeleteModal show={false}
        btnFunction={mockBtnFn}
        inProgress={false}
        showModal={mockShowFn}
        hideModal={mockCancelFn}
        message="msg" />
    );

    it('should have a negative delete button', () => {
      expect(wrapper.find('.negative.button').exists()).toBe(true);
      expect(wrapper.find('.button').text()).toBe('Delete');

      wrapper.unmount();
    });
  });
});
