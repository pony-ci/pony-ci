import React from "react";
import {Container, Dropdown, Menu} from "semantic-ui-react";
import {Link} from "react-router-dom";

function NavBar() {
    return (
        <Menu fixed='top' inverted>
            <Container>
                <Link to='/'>
                    <Menu.Item as='a' header>
                        {/*<Image size='mini' src='../logo.svg' style={{marginRight: '1.5em'}}/>*/}
                        Pony CI
                    </Menu.Item>
                </Link>
                <Link to='/docs'>
                    <Menu.Item as='a'>SFDX Plugin</Menu.Item>
                </Link>
                {/*<Dropdown item simple text='Dropdown'>*/}
                {/*    <Dropdown.Menu>*/}
                {/*        <Dropdown.Item>List Item</Dropdown.Item>*/}
                {/*        <Dropdown.Item>List Item</Dropdown.Item>*/}
                {/*        <Dropdown.Divider/>*/}
                {/*        <Dropdown.Header>Header Item</Dropdown.Header>*/}
                {/*        <Dropdown.Item>*/}
                {/*            <i className='dropdown icon'/>*/}
                {/*            <span className='text'>Submenu</span>*/}
                {/*            <Dropdown.Menu>*/}
                {/*                <Dropdown.Item>List Item</Dropdown.Item>*/}
                {/*                <Dropdown.Item>List Item</Dropdown.Item>*/}
                {/*            </Dropdown.Menu>*/}
                {/*        </Dropdown.Item>*/}
                {/*        <Dropdown.Item>List Item</Dropdown.Item>*/}
                {/*    </Dropdown.Menu>*/}
                {/*</Dropdown>*/}
            </Container>
        </Menu>
    );
}

export default NavBar;
