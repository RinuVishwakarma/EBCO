import { NextResponse } from 'next/server'
import CCAvenue from '@/utils/ccavenue'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const authToken = url.searchParams.get('token')

    const body = await request.text()
    const formData = new URLSearchParams(body)
    const encResp = formData.get('encResp')

    if (!encResp) {
      throw new Error('Missing or invalid encResp parameter')
    }

    // Decrypt the Response Data from Request Body
    const data = CCAvenue.redirectResponseToJson(encResp)
    const id = data.order_id
    const status =
      data.order_status === 'Success'
        ? 'completed'
        : data.order_status === 'Aborted'
        ? 'cancelled'
        : 'failed'

    // Make the API call to your WordPress backend
    const response = await axios.post(
      `${API_ENDPOINT.POST.updateOrderStatus}/${id}`,
      {
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      },
    )

    if (data.order_status === 'Success') {
      // Redirect to Payment Success Page
      const redirectUrl = new URL('/success', request.url)
      redirectUrl.searchParams.set('data', id)

      return NextResponse.redirect(redirectUrl, 302)
    } else {
      // Redirect to Payment Failed Page
      const redirectUrl = new URL('/failed', request.url)
      redirectUrl.searchParams.set('data', id)

      return NextResponse.redirect(redirectUrl, 302)
    }
  } catch (error) {
    // Redirect to Payment Failed Page
    const redirectUrl = new URL('/failed', request.url)
    return NextResponse.redirect(redirectUrl.toString(), 302)
  }
}
