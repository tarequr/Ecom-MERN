import React from 'react'

function Footer() {
  return (
    <footer className='footer flex-space-around'>
        <div className='flex-space-around'>
            <form action="">
                <label htmlFor="subscribe">Subscribe to our newsletter: </label>
                <input type="email" name="subscribe" id="subscribe" className='footer_input' placeholder='Enter your email'/>
                <button type='submit' className='btn-subscribe'>Subscribe</button>
            </form>
        </div>
        <div>
            <p>Copyright &copy; 2023 Tarequr Rahman Sabbir | All rights reserved</p>
        </div>
    </footer>
  )
}

export default Footer
