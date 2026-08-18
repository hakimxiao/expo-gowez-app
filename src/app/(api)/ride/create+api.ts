import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
    } = body;

    const requiredFields = {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => value === undefined || value === null || value === "")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return Response.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    if (!process.env.DATABASE_URL) {
      return Response.json(
        { error: "DATABASE_URL belum dikonfigurasi" },
        { status: 500 },
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    const response = await sql`
      INSERT INTO rides ( 
          origin_address, 
          destination_address, 
          origin_latitude, 
          origin_longitude, 
          destination_latitude, 
          destination_longitude, 
          ride_time, 
          fare_price, 
          payment_status, 
          driver_id, 
          user_id
      ) VALUES (
          ${origin_address},
          ${destination_address},
          ${origin_latitude},
          ${origin_longitude},
          ${destination_latitude},
          ${destination_longitude},
          ${ride_time},
          ${fare_price},
          ${payment_status},
          ${driver_id},
          ${user_id}
      )
      RETURNING *;
    `;

    return Response.json({ data: response[0] }, { status: 201 });
  } catch (error) {
    console.error("Error inserting data into recent_rides:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
