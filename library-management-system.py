import os
import json
import tkinter as tk
from tkinter import messagebox

DATA_FILE = "library_data.json"

# Initialize library data
import fcntl

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as file:
        try:
            fcntl.flock(file, fcntl.LOCK_EX | fcntl.LOCK_NB)
            json.dump({"books": [], "members": [], "transactions": []}, file)
        finally:
            fcntl.flock(file, fcntl.LOCK_UN)

def load_data():
    with open(DATA_FILE, "r") as file:
        return json.load(file)

def save_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

def add_book(title, author, isbn):
    data = load_data()
    data["books"].append({"title": title, "author": author, "isbn": isbn, "available": True})
    save_data(data)

def add_member(name, member_id):
    data = load_data()
    data["members"].append({"name": name, "member_id": member_id})
    save_data(data)

def issue_book(isbn, member_id):
    data = load_data()
    for book in data["books"]:
        if book["isbn"] == isbn and book["available"]:
            book["available"] = False
            data["transactions"].append({"isbn": isbn, "member_id": member_id, "action": "issued"})
            save_data(data)
            return True
    return False

def return_book(isbn, member_id):
    data = load_data()
    for book in data["books"]:
        if book["isbn"] == isbn and not book["available"]:
            book["available"] = True
            data["transactions"].append({"isbn": isbn, "member_id": member_id, "action": "returned"})
            save_data(data)
            return True
    return False

def gui_add_book():
    def submit():
        title = title_entry.get()
        author = author_entry.get()
        isbn = isbn_entry.get()
        if title and author and isbn:
            add_book(title, author, isbn)
            messagebox.showinfo("Success", f"Book '{title}' added successfully.")
            add_book_window.destroy()
        else:
            messagebox.showerror("Error", "All fields are required.")

    add_book_window = tk.Toplevel(root)
    add_book_window.title("Add Book")
    tk.Label(add_book_window, text="Title:").grid(row=0, column=0)
    tk.Label(add_book_window, text="Author:").grid(row=1, column=0)
    tk.Label(add_book_window, text="ISBN:").grid(row=2, column=0)
    title_entry = tk.Entry(add_book_window)
    author_entry = tk.Entry(add_book_window)
    isbn_entry = tk.Entry(add_book_window)
    title_entry.grid(row=0, column=1)
    author_entry.grid(row=1, column=1)
    isbn_entry.grid(row=2, column=1)
    tk.Button(add_book_window, text="Submit", command=submit).grid(row=3, columnspan=2)

def gui_add_member():
    # Function to handle the submission of the "Add Member" form
    def submit():
        # Get the values entered by the user
        name = name_entry.get()
        member_id = member_id_entry.get()
        
        # Check if both fields are filled
        if name and member_id:
            # Add the member to the library system
            add_member(name, member_id)
            # Show a success message
            messagebox.showinfo("Success", f"Member '{name}' added successfully.")
            # Close the "Add Member" window
            add_member_window.destroy()
        else:
            # Show an error message if any field is empty
            messagebox.showerror("Error", "All fields are required.")

    # Create a new window for adding a member
    add_member_window = tk.Toplevel(root)
    add_member_window.title("Add Member")
    
    # Add labels for the input fields
    tk.Label(add_member_window, text="Name:").grid(row=0, column=0)
    tk.Label(add_member_window, text="Member ID:").grid(row=1, column=0)
    
    # Create input fields for name and member ID
    name_entry = tk.Entry(add_member_window)
    member_id_entry = tk.Entry(add_member_window)
    
    # Place the input fields in the window
    name_entry.grid(row=0, column=1)
    member_id_entry.grid(row=1, column=1)
    
    # Add a submit button to the window
    tk.Button(add_member_window, text="Submit", command=submit).grid(row=2, columnspan=2)

def gui_issue_book():
    def submit():
        isbn = isbn_entry.get()
        member_id = member_id_entry.get()
        if isbn and member_id:
            if issue_book(isbn, member_id):
                messagebox.showinfo("Success", f"Book with ISBN '{isbn}' issued to member '{member_id}'.")
                issue_book_window.destroy()
            else:
                messagebox.showerror("Error", f"Book with ISBN '{isbn}' is not available.")
        else:
            messagebox.showerror("Error", "All fields are required.")

    issue_book_window = tk.Toplevel(root)
    issue_book_window.title("Issue Book")
    tk.Label(issue_book_window, text="ISBN:").grid(row=0, column=0)
    tk.Label(issue_book_window, text="Member ID:").grid(row=1, column=0)
    isbn_entry = tk.Entry(issue_book_window)
    member_id_entry = tk.Entry(issue_book_window)
    isbn_entry.grid(row=0, column=1)
    member_id_entry.grid(row=1, column=1)
    tk.Button(issue_book_window, text="Submit", command=submit).grid(row=2, columnspan=2)

def gui_return_book():
    def submit():
        isbn = isbn_entry.get()
        member_id = member_id_entry.get()
        if isbn and member_id:
            if return_book(isbn, member_id):
                messagebox.showinfo("Success", f"Book with ISBN '{isbn}' returned by member '{member_id}'.")
                return_book_window.destroy()
            else:
                messagebox.showerror("Error", f"Book with ISBN '{isbn}' was not issued.")
        else:
            messagebox.showerror("Error", "All fields are required.")

    return_book_window = tk.Toplevel(root)
    return_book_window.title("Return Book")
    tk.Label(return_book_window, text="ISBN:").grid(row=0, column=0)
    tk.Label(return_book_window, text="Member ID:").grid(row=1, column=0)
    isbn_entry = tk.Entry(return_book_window)
    member_id_entry = tk.Entry(return_book_window)
    isbn_entry.grid(row=0, column=1)
    member_id_entry.grid(row=1, column=1)
    tk.Button(return_book_window, text="Submit", command=submit).grid(row=2, columnspan=2)

def gui_view_books():
    books_window = tk.Toplevel(root)
    books_window.title("Books in Library")
    data = load_data()
    for book in data["books"]:
        status = "Available" if book["available"] else "Issued"
        tk.Label(books_window, text=f"Title: {book['title']}, Author: {book['author']}, ISBN: {book['isbn']}, Status: {status}").pack()

def gui_view_members():
    members_window = tk.Toplevel(root)
    members_window.title("Library Members")
    data = load_data()
    for member in data["members"]:
        tk.Label(members_window, text=f"Name: {member['name']}, Member ID: {member['member_id']}").pack()

def gui_view_transactions():
    transactions_window = tk.Toplevel(root)
    transactions_window.title("Transactions")
    data = load_data()
    for transaction in data["transactions"]:
        tk.Label(transactions_window, text=f"ISBN: {transaction['isbn']}, Member ID: {transaction['member_id']}, Action: {transaction['action']}").pack()

root = tk.Tk()
root.title("Library Management System")

tk.Button(root, text="Add Book", command=gui_add_book).pack(fill=tk.X)
tk.Button(root, text="Add Member", command=gui_add_member).pack(fill=tk.X)
tk.Button(root, text="Issue Book", command=gui_issue_book).pack(fill=tk.X)
tk.Button(root, text="Return Book", command=gui_return_book).pack(fill=tk.X)
tk.Button(root, text="View Books", command=gui_view_books).pack(fill=tk.X)
tk.Button(root, text="View Members", command=gui_view_members).pack(fill=tk.X)
tk.Button(root, text="View Transactions", command=gui_view_transactions).pack(fill=tk.X)
tk.Button(root, text="Exit", command=root.quit).pack(fill=tk.X)

root.mainloop()