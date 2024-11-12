import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { format, parseISO } from "date-fns";

const Events = () => {
  const [eventData, setEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getEventData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/events`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.bookings;
      const sortedEventData = data.sort((a, b) => {
        const aDate = a.eventStartDate ? new Date(a.eventStartDate) : new Date(a.eventDate);
        const bDate = b.eventStartDate ? new Date(b.eventStartDate) : new Date(b.eventDate);
        return aDate - bDate;
      });

      setEventData(sortedEventData);
      setIsLoading(false);

      if (response.status !== 200) {
        throw new Error(response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEventData();
  }, []);

  return (
    <div className="mt-6 min-h-screen">
      <h1 className="text-xl sm:text-3xl md:text-4xl text-center font-black leading-7 text-gray-800">
        Upcoming<span className="text-indigo-700"> Events</span>
      </h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : eventData.length ? (
        <div className="mt-8 mx-auto max-w-5xl">
          {/* Header Row */}
          <div className="flex justify-between items-center bg-indigo-100 p-4 rounded-lg mb-2 font-bold text-gray-700">
            <div className="w-1/4">Event Name</div>
            <div className="w-1/4">Venue</div>
            <div className="w-1/4">Organizing Club</div>
            <div className="w-1/4">Date</div>
            <div className="w-1/4">Time</div>
            <div className="w-1/4">Coordinator</div>
          </div>
          {/* Event Rows */}
          {eventData.map((event) => (
            <div key={event._id} className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-4">
              <div className="w-1/4 text-lg font-bold text-navy-500">{event.eventName}</div>
              <div className="w-1/4 text-sm text-gray-600">{event.bookedHallName}</div>
              <div className="w-1/4 text-sm text-gray-600">{event.organizingClub}</div>
              <div className="w-1/4 text-sm text-gray-600">
                {event.eventDateType === "multiple"
                  ? `${format(new Date(event.eventStartDate), "dd-MM-yyyy")} to ${format(new Date(event.eventEndDate), "dd-MM-yyyy")}`
                  : format(new Date(event.eventDate), "dd-MM-yyyy")}
              </div>
              <div className="w-1/4 text-sm text-gray-600">
                {event.eventDateType === "half"
                  ? `${format(parseISO(event.startTime.slice(0, -1)), "hh:mm aa")} - ${format(parseISO(event.endTime.slice(0, -1)), "hh:mm aa")}`
                  : "-"}
              </div>
              <div className="w-1/4 text-sm text-gray-600">{event.eventManager}</div>
            </div>
          ))}
        </div>
      ) : (
        <h2 className="text-2xl font-bold text-zinc-700 text-center mt-10">
          No Upcoming Events.
        </h2>
      )}
    </div>
  );
};

export default Events;
