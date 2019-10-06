import React from 'react';
import { shallow } from 'enzyme';
import NavBar from './NavBar';

describe('<NavBar />', () => {
  describe('render()', () => {
    it('renders the component', () => {
      const wrapper = shallow(<NavBar />);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
