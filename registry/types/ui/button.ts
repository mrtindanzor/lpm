import type { ExtractVariantsTypes } from "lpm/library/ExtractVariants"
import type { ButtonVariants } from "lpm/ui/Buttons/Button"
import type { LinkProps } from "next/link"
import type { ComponentProps } from "react"

export type ButtonVariantTypes = ExtractVariantsTypes<typeof ButtonVariants>
export type ButtonProps = ComponentProps<"button"> & ButtonVariantTypes

export type BackButtonProps = ButtonProps & {
	backUrl?: string
}

export type StyledLinkProps = ButtonVariantTypes &
	LinkProps &
	ComponentProps<"a">

export type ArrowBackButtonProps = BackButtonProps & {
	wrapperClassName?: string
	iconClassName?: string
}

export type CloseButtonProps = {
	close: () => void
} & ButtonProps &
	ComponentProps<"button">
