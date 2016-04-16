# IT Setups App Requirements

## UI

- Header should display building on the left, date and time in the middle, user name on the right.
- Date/time header should have arrow buttons to the left and right to jump back or ahead by one day.
- Calendar should display a total of three days at one time, previous, current, and next.
- There should be a red line on the calendar indicating the current time (when showing the present day), which should be updated at some regular interval.
- There should be a button somewhere which re-centers the calendar on the present time.

## Style

- Light and dark (night) theming (use case for SASS)

## Import logic

- Check extension -> assume type and call appropriate function.
- Functions generate lists of event objects.
    - Separate events with same event number, building, space, and overlapping times should be merged, and resources with times not matching the event's should have their own times recorded (optional fields in resource object)
    - Events overlapping in time and space should throw an error.
- **In production:** Ignore (do not import) any events with past dates. Should also be locked at the database level.
- Fetch all events for the buildings and times in the set.
- Check export date(s) for fetched items. If any are newer or the same as the export date for new items, abort ("this file appears to be stale")
- For each event fetched, compare with each new event.
    - For every perfect match (time, space, name, number, all resources), remove from both sets.
    - Prompt to continue, giving number of insertions and deletions,
    - Delete each item remaining in the fetched list, and insert all items remaining in the 

- Conflict resolution:
    - Imported events which match all properties (except for setup/pickup checks, and cancelled resources) should be ignored.
    - Imported events which which match or overlap time and space should prompt arbitration.
        - Event viewer component can be used to display conflicting events side by side and prompt resolution by selecting one or the other, merging, or allowing overlap.
        - Default for auto-upload should be replace with new.

## Editing events

- There should be a limited interface for editing events in the app.
- It should be accessible through the main popup event viewer (edit button)
- Resources should not be cancelled, but deleted
    - Cancellation should move the resource to a 'canceled' list, so that comparison with incoming conflicting events still holds.
