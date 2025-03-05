import { Footer } from "flowbite-react";
import store from '../assets/store.png'

const Footer = () => {
    return (
        <div className='mt-auto' >
            <Footer container>
                <div className="w-full text-center">
                    <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
                        <Footer.Brand
                            href="#"
                            src={store}
                            alt="store Logo"
                        />
                        <Footer.LinkGroup>
                            <Footer.Link href="#">About</Footer.Link>
                            <Footer.Link href="#">Privacy Policy</Footer.Link>
                            <Footer.Link href="#">Licensing</Footer.Link>
                            <Footer.Link href="#">Contact</Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <Footer.Divider />
                    <Footer.Copyright href="#" by="Store™" year={2025} />
                </div>
            </Footer>
        </div>
    );
}

export default Footer;