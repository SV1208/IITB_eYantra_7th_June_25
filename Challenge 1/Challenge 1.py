# Define the Grand Clock Tower time
grand_clock_time = "15:00"

# Define the clock times around town
clock_times = ["Shivanshu", "15:05", "15:00", "14:40"]

def calculate_time_difference(grand_time, clock_times):
    # Convert the Grand Clock Tower time to minutes
    grand_hours, grand_minutes = map(int, grand_time.split(":"))
    grand_total_minutes = grand_hours * 60 + grand_minutes

    # Initialize an array to store the time differences
    time_differences = []

    # Calculate the difference for each clock
    for clock_time in clock_times:
        try:
            clock_hours, clock_minutes = map(int, clock_time.split(":"))
            clock_total_minutes = clock_hours * 60 + clock_minutes
            time_difference = clock_total_minutes - grand_total_minutes
            time_differences.append(time_difference)
        except ValueError:
            # Skip invalid time formats
            continue

    return time_differences

# Calculate the time differences
differences = calculate_time_difference(grand_clock_time, clock_times)

# Output the result
print("Time differences (in minutes):", differences)