#include <stdio.h>
#include <stdlib.h>

#define GRAND_CLOCK_HOUR 15
#define GRAND_CLOCK_MINUTE 0

// Function to calculate the time difference in minutes
int calculate_time_difference(int clock_hour, int clock_minute) {
    int grand_clock_total_minutes = GRAND_CLOCK_HOUR * 60 + GRAND_CLOCK_MINUTE;
    int clock_total_minutes = clock_hour * 60 + clock_minute;
    return clock_total_minutes - grand_clock_total_minutes;
}

int main() {
    // Clock times around town
    int clock_hours[] = {14, 15, 15, 14, 15};
    int clock_minutes[] = {45, 5, 0, 40, 2};
    int num_clocks = sizeof(clock_hours) / sizeof(clock_hours[0]);

    // Array to store the time differences
    int time_differences[num_clocks];

    // Calculate the time differences for each clock
    for (int i = 0; i < num_clocks; i++) {
        time_differences[i] = calculate_time_difference(clock_hours[i], clock_minutes[i]);
    }

    // Output the results
    printf("Time differences (in minutes):\n");
    for (int i = 0; i < num_clocks; i++) {
        printf("Clock %d: %d minutes\n", i + 1, time_differences[i]);
    }

    return 0;
}