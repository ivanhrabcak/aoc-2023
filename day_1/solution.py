def first_digit(s: str, index = False):
    for i, c in enumerate(s):
        if c.isdigit():
            return c if not index else i

def part_one(puzzle_input: list[str]):
    return sum([int(first_digit(d) + first_digit(d[::-1])) for d in puzzle_input])

def get_first_digit(value: str, digit_words: list[str]) -> str:
    first_digit_index = first_digit(value, True)

    digit_word_indices = [value.index(n) for n in digit_words if n in value]
    digit_words_indices = [i for i, n in enumerate(digit_words) if n in value]

    smallest_digit_word_index = min([len(value) + 1, *digit_word_indices])
    first_digit_word_index = digit_word_indices.index(smallest_digit_word_index) if smallest_digit_word_index != len(value) + 1 else len(value) + 1

    if smallest_digit_word_index < first_digit_index:
        return str(digit_words_indices[first_digit_word_index])
    else:
        return value[first_digit_index]

def part_two(puzzle_input: list[str]):
    calibration_sum = 0
    numbers = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine"
    ]

    reversed_numbers = [n[::-1] for n in numbers]

    for value in puzzle_input:
        first_digit = get_first_digit(value, numbers)

        reversed_value = value[::-1]

        last_digit = get_first_digit(reversed_value, reversed_numbers)

        calibration_sum += int(first_digit + last_digit)
    
    return calibration_sum


with open("input.txt", "r") as f:
    puzzle_input = f.read().split("\n")

    print(part_one(puzzle_input))
    print(part_two(puzzle_input))