use std::fs;
// use std::cmp::min;

fn transform_seed(steps: &Vec<Vec<(u64, u64, u64)>>, seed: u64) -> u64 {
    let mut transformed_seed = seed;
    for ranges in steps {
        for (dest_start, src_start, size) in ranges {
            let src_end = src_start + size;

            if &transformed_seed >= src_start && transformed_seed <= src_end {
                transformed_seed = (transformed_seed - src_start) + dest_start;
                break;
            }
        }
    }

    return transformed_seed
}

fn main() {
    let contents = fs::read_to_string("../input.txt")
        .expect("failed to read input");

    let mut input_parts: Vec<&str> = contents.split("\n\n").collect();
    input_parts.reverse();

    let seed_numbers = input_parts.pop().unwrap()
        .split(": ").nth(1).unwrap()
        .split(" ").collect::<Vec<&str>>();

    let seeds = seed_numbers
        .iter().map(|k| k.parse::<u64>())
        .filter(|r| r.is_ok())
        .map(|r| r.unwrap())
        .collect::<Vec<u64>>();

    input_parts.reverse();

    let conversion_steps = input_parts.iter()
        .map(|m| m.split('\n').collect::<Vec<&str>>())
        .map(|m| m[1..].iter()
            .map(|l| {
                let range = l.split(' ')
                    .map(|i| i.parse::<u64>())
                    .filter(|r| r.is_ok())
                    .map(|r| r.unwrap()).collect::<Vec<u64>>();

                (range[0], range[1], range[2])
            }
                
            ).collect::<Vec<(u64, u64, u64)>>()
        ).collect::<Vec<Vec<(u64, u64, u64)>>>();

    println!("{:?}", conversion_steps);

    let mut minimum = u64::MAX;
    for i in (0..seeds.len()).step_by(2) {
        let start = seeds[i];
        let size = seeds[i + 1];

        let end = start + size;

        for k in start..=end {
            let potentially_new_minimum = transform_seed(&conversion_steps, k);
            if potentially_new_minimum < minimum {
                minimum = potentially_new_minimum;
                println!("new minimum {}!", minimum);
            }
        }

        println!("{}/{}", i, seeds.len() / 2);
    }

    println!("{minimum}");
}
