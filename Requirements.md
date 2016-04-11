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

- Check extension -> assume type and call appropriate function:
    - TTX:
        - Initialize state object
        - Initialize event object
        - For each line, split on tabs, strip quote marks
        - Check if first line is date
            - If not, throw error.
        - Set state.exported to date.
        -

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
