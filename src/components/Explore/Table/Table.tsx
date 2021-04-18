import { MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { useEffect, useState } from 'react'

import Config from '@shelf/helpers/Config'
import './Table.css'

function Table(props: any): JSX.Element {
  const [load, setLoad] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    setLoad(true)

    const url = `${Config.BaseApiUrl}/api/v1/shelf/all/${props.listType}`
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.statusCode === 200) {
          const shelves = JSON.parse(data.message)
          setItems(shelves)
        }
      })
      .finally(() => setLoad(false))
  }, [props.listType])

  function redirectToShelf(shelfId: string): void {
    window.location.href = '/s/' + shelfId
  }

  return (
    <MDBTable hover className="table-custom">
      <MDBTableHead>
        <tr>
          <th>created</th>
          <th>title</th>
          <th># resources</th>
          <th># views</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {load === true &&
          <span>loading...</span>
        }

        {load === false &&
          items.map((value) => {
            const date = getDate(value['created'])
            const resources = value['resources'] as string[]

            return (
              <tr key={value['_id']} className="table-row-custom" onClick={() => redirectToShelf(value['_id'])}>
                <td>{ date }</td>
                <td>{ value['title'] }</td>
                <td>{ resources.length }</td>
                <td>{ value['views'] }</td>
              </tr>
            )
          })
        }
      </MDBTableBody>
    </MDBTable>
  )
}

function getDate(epoch: number): string {
  const date = new Date(0)
  date.setUTCSeconds(epoch)

  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
  const year = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(date)

  return `${day}-${month}-${year}`.toLowerCase()
}

export default Table
