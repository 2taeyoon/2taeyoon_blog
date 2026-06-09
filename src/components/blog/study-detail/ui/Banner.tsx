import React from 'react'
import { CardProps } from "@/types/blog/card.types"

type BannerProps = {
  card: CardProps;
};

export default function Banner({ card }: BannerProps) {
	return (
		<div className="banner">
			<div className="banner_image" style={{ background: `url('${card?.image}') center center / cover` }}></div>
			<div className="banner_info">
				{card?.link && (
          <div className="card_link_wrap">
						<a href={card.link} className="card_link" target="_blank" rel="noopener noreferrer">사이트 바로가기</a>
					</div>
        )}
				<div className="card_title">{card?.title}</div>
				<div className="card_date">{card?.date}</div>
				{ card.skills ?
					<div className="card_skill_wrap">
						{ card.skills.map((skill, skillIndex) => (
							<div key={skillIndex} className="card_skill" style={{ backgroundColor: skill.color }}>
								<div className="skill_img" style={{ background: `url('${skill.icon}') center center / cover` }}></div>
								<div className="skill_text">{skill.name}</div>
							</div>
						))}
					</div> : null
				}
				{ card?.hashs ? (
					<div className="card_hash_wrap">
						{ card.hashs.map((hash, hashIndex) => (
							<div key={hashIndex} className="card_hash">
								<div className="hash_text">{hash.name}</div>
							</div>
						))}
					</div>	) : null}
			</div>
		</div>
	)
}