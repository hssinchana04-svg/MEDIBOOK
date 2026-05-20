import React from 'react'

const Contact = () => {
  return (
    <div>
      <h2 className='text-2xl font-bold text-gray-800 mb-8 text-center'>Contact Us</h2>
      <div className='flex flex-col md:flex-row gap-10'>
        <div className='md:w-1/2 space-y-6'>
          {[
            { icon: '📍', title: 'Our Address', desc: '54709 Willms Station, Suite 350, Washington, USA' },
            { icon: '📞', title: 'Phone', desc: '+91 98765 43210' },
            { icon: '📧', title: 'Email', desc: 'support@medibook.com' },
          ].map((item, i) => (
            <div key={i} className='flex gap-4 p-5 border border-gray-200 rounded-xl hover:shadow-sm'>
              <div className='text-3xl'>{item.icon}</div>
              <div>
                <p className='font-semibold text-gray-800'>{item.title}</p>
                <p className='text-gray-500 text-sm mt-1'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className='md:w-1/2 border border-gray-200 rounded-xl p-6'>
          <h3 className='font-semibold text-gray-800 mb-4'>Send a Message</h3>
          <div className='space-y-4'>
            <input type='text' placeholder='Your Name' className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500' />
            <input type='email' placeholder='Your Email' className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500' />
            <textarea rows={4} placeholder='Your Message' className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 resize-none' />
            <button className='w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700'>Send Message</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact