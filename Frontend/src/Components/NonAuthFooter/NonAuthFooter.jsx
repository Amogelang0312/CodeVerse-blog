import React from 'react'
import './NonAuthFooter.css'

function NonAuthFooter() {
  return (
    <div className='main-footer-container'>
            <div className='row'>
                <div className='footer-text-contact'>
                   <div className='guide-text'>
                        <h3>
                            Contact:
                         </h3>
                    </div> 
                    <ul className='list-unstyled'>
                        <li>012 345 6789/Reach out at Code@Verse.co.za</li>
                        <li>123 Pretoria, South Africa</li>
                        <li>© 2025 CodeVerse. All rights reserved.</li>
                    </ul>
                </div>
            </div>
    </div>
  )
}

export default NonAuthFooter