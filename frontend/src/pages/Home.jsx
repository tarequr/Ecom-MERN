import React from 'react'
import PageTitle from '../components/PageTitle'
import ProductSidebar from '../components/ProductSidebar'


function Home() {
  return (
    <>
      <PageTitle title="Home" />
      <div className='container flex-space-around'>
        <div className='sidebar-container'>
          <ProductSidebar />
        </div>
        <div className='main-container'>
          <h2>List of All products</h2>
        </div>
      </div>
    </>
  )
}

export default Home