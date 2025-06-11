import random
import tkinter as tk
from tkinter import messagebox

def get_computer_choice():
    return random.choice(['rock', 'paper', 'scissors'])

def determine_winner(user_choice, computer_choice):
    if user_choice == computer_choice:
        return "It's a tie!"
    elif (user_choice == 'rock' and computer_choice == 'scissors') or \
         (user_choice == 'paper' and computer_choice == 'rock') or \
         (user_choice == 'scissors' and computer_choice == 'paper'):
        return "You win!"
    else:
        return "Computer wins!"

def play_game(user_choice):
    computer_choice = get_computer_choice()
    result = determine_winner(user_choice, computer_choice)
    messagebox.showinfo("Result", f"You chose: {user_choice}\nComputer chose: {computer_choice}\n{result}")

# Create the main window
root = tk.Tk()
root.title("Rock-Paper-Scissors")

# Add buttons for user choices
tk.Label(root, text="Choose one:", font=("Arial", 14)).pack(pady=10)

tk.Button(root, text="Rock", font=("Arial", 12), command=lambda: play_game('rock')).pack(pady=5)
tk.Button(root, text="Paper", font=("Arial", 12), command=lambda: play_game('paper')).pack(pady=5)
tk.Button(root, text="Scissors", font=("Arial", 12), command=lambda: play_game('scissors')).pack(pady=5)

# Run the application
root.mainloop()